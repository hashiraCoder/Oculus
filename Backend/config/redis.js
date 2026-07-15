import Redis from 'ioredis';
import logger from './logger.js';

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
});

redis.on('error', (err) => {
    logger.error('[REDIS ERROR] Connection failed', err);
});

export default redis;