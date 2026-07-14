import { asynchandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import AuthService from '../services/auth.service.js';

class AuthController {
    static setRefreshCookie(res, refreshToken) {
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }

    static register = asynchandler(async (req, res) => {
        const { email, password, name } = req.body;
        const { user, workspaces, accessToken, refreshToken, isDuplicate } = await AuthService.registerUser(email, password, name);

        if (isDuplicate) {
            throw new ApiError(409, 'Email is already registered in the system.');
        }

        AuthController.setRefreshCookie(res, refreshToken);

        return res
            .status(201)
            .json(new ApiResponse(201, {
                user,
                workspaces,
                accessToken
            }, 'Registration successful. Default workspace created.'));
    });

    static login = asynchandler(async (req, res) => {
        const { email, password } = req.body;
        const { user, workspaces, accessToken, refreshToken } = await AuthService.loginUser(email, password, req.ip);

        AuthController.setRefreshCookie(res, refreshToken);

        return res
            .status(200)
            .json(new ApiResponse(200, {
                user,
                workspaces,
                accessToken
            }, 'Login successful.'));
    });

    static refresh = asynchandler(async (req, res) => {
        const { user, workspaces, accessToken, refreshToken } = await AuthService.refreshSession(req.cookies?.refresh_token);

        AuthController.setRefreshCookie(res, refreshToken);

        return res
            .status(200)
            .json(new ApiResponse(200, {
                user,
                workspaces,
                accessToken
            }, 'Session refreshed.'));
    });
}

export default AuthController;