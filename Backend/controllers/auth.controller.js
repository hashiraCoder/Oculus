import { asynchandler } from '../utils/asynchandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import AuthService from '../services/auth.service.js';

class AuthController {
    
    // Wrapped in your custom asyncHandler to drop the try...catch
    static register = asynchandler(async (req, res) => {
        const { email, password, name } = req.body;
        
        // Let the service handle the DB logic. If it fails, we throw an ApiError
        const { user, token, isDuplicate } = await AuthService.registerUser(email, password, name);

        // Example of throwing your custom ApiError for bad requests
        if (isDuplicate) {
            throw new ApiError(409, "Email is already registered in the system.");
        }

        // Construct secure HttpOnly cookie
        res.cookie('jwt_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Use your custom ApiResponse for a unified success structure
        const payload = { userId: user.id, email: user.email };
        
        return res
            .status(201)
            .json(new ApiResponse(201, payload, "Registration successful. Default workspace created."));
    });
}

export default AuthController;