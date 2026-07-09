import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import ApiError from '../utils/apiError.js'
import {User} from '../models/user.model.js'

export const verifyJwt = asynchandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(404, "Unauthorize request found")
        }
        const decodeToken = jwt.verify(token, ACCESS_TOKEN_SCERET)
        const user = User.findById(decodeToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }
        req.user = user
        next()
    }
    catch (error) {
        throw new ApiError(401, "error?.message" || "invalid accessToken")
    }
})