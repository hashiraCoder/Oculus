import {
    registerUser,
    loginUser,
    refreshSession,
    logoutSession
} from '../auth/services/index.js';

class AuthService {
    static registerUser(email, password, name) {
        return registerUser(email, password, name);
    }

    static loginUser(email, password, requestIp) {
        return loginUser(email, password, requestIp);
    }

    static refreshSession(refreshToken) {
        return refreshSession(refreshToken);
    }

    static logoutSession(refreshToken) {
        return logoutSession(refreshToken);
    }
}

export default AuthService;
