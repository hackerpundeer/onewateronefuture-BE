import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { isMongoLive, markMongoDisconnected } from '../db.js';

const JWT_EXPIRY = '7d';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
}

export function signAdminToken(admin: AdminPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(
    { sub: admin.id, email: admin.email, name: admin.name },
    secret,
    { expiresIn: JWT_EXPIRY }
  );
}

export function verifyAdminToken(token: string): AdminPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
  return {
    id: String(decoded.sub),
    email: String(decoded.email),
    name: String(decoded.name || ''),
  };
}

export async function loginAdmin(email: string, password: string) {
  const live = await isMongoLive();
  if (!live) {
    throw new Error('Database not connected — admin login requires MongoDB');
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return null;
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return null;
    }

    const payload: AdminPayload = {
      id: String(admin._id),
      email: admin.email,
      name: admin.name || '',
    };

    return {
      token: signAdminToken(payload),
      admin: payload,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Admin login failed';
    markMongoDisconnected(message);
    throw new Error('Database connection lost — please try again');
  }
}

export async function seedDefaultAdmin(): Promise<void> {
  const live = await isMongoLive();
  if (!live) {
    console.warn('Skipping admin seed — MongoDB not connected');
    return;
  }

  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('ADMIN_EMAIL and ADMIN_PASSWORD not set — skipping admin seed');
    return;
  }

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.create({ email, passwordHash, name: 'Admin' });
    console.log(`Default admin account created for ${email}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Admin seed failed';
    markMongoDisconnected(message);
    console.warn(`Admin seed failed: ${message}`);
  }
}
