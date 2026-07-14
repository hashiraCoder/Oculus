import jwt from 'jsonwebtoken';
import { asynchandler } from '../utils/asyncHandler.js';
import config from '../config/env.js';
import ApiError from '../utils/apiError.js';

export const verifyJwt = asynchandler(async (req, res, next) => {
    const token = req.cookies?.jwt_token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new ApiError(401, 'Unauthorized request');
    }
    
    try {
        req.user = jwt.verify(token, config.jwt.secret);
        return next();
    } catch (error) {
        throw new ApiError(401, 'Invalid access token');
    }
})