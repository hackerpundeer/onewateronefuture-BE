import rateLimit from 'express-rate-limit';

export const publicPostRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    data: null,
    error: { message: 'Too many requests, please try again later', code: 'RATE_LIMITED' },
    meta: {},
  },
});
