import redis from '../config/redis.js';
import ApiError from '../utils/apiError.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 15 * 60; // 15 minutes

class LockoutService {
    static async checkLockout(email) {
        const attempts = await redis.get(`login_attempts:${email}`);
        if (attempts && parseInt(attempts) >= MAX_FAILED_ATTEMPTS) {
            // Throw a generic error to avoid confirming the account exists
            throw new ApiError(429, "Too many login attempts. Please try again later.");
        }
    }

    static async incrementFailedAttempts(email) {
        const key = `login_attempts:${email}`;
        const attempts = await redis.incr(key);
        
        if (attempts === 1) {
            // Set expiration on the first failed attempt
            await redis.expire(key, LOCKOUT_DURATION_SECONDS);
        }
        return attempts;
    }

    static async clearFailedAttempts(email) {
        await redis.del(`login_attempts:${email}`);
    }
}

export default LockoutService;