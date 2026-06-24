import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'senacodex',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRE || '24h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

// Security checks: prevent running in production with insecure defaults
if (config.nodeEnv === 'production') {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not set in production. Aborting.');
    process.exit(1);
  }
  if (process.env.DB_PASSWORD === 'postgres' || !process.env.DB_PASSWORD) {
    console.error('FATAL: DB_PASSWORD is using an insecure default in production. Aborting.');
    process.exit(1);
  }
}
