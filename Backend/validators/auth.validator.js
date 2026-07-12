import Joi from "joi";
import validate from "../utils/validator";

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required().messages({
        'string.min': 'Password must be at least 12 characters.'
    }),
    name: Joi.string().min(2).max(50).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const validateRegister = validate(registerSchema);
const validateLogin = validate(loginSchema);
export {
    validateRegister,
    validateLogin
};