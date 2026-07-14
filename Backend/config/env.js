// fast fail check of envirroment variables
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const requiredEnvVars = [
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'JWT_SECRET'
];

// Fail fast if critical environment variables are missing
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`[FATAL ERROR] Missing required environment variable: ${envVar}`);
        process.exit(1); // exit when db is down
    }
});

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        database: process.env.DB_NAME,
        // Optional: Maximum number of clients in the pool
        maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE, 10) || 20,
    },
    github: {
        appId: process.env.GITHUB_APP_ID,
        privateKey: process.env.GITHUB_PRIVATE_KEY,
        webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
    }
};

export default config;