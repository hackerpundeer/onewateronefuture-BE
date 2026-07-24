export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  frontendUrl: process.env.FRONTEND_URL || '',
};

export function getCorsOrigins(): string[] | undefined {
  const raw = env.frontendUrl.trim();
  if (!raw) return undefined;
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
}

export function isProduction(): boolean {
  return env.nodeEnv === 'production';
}
