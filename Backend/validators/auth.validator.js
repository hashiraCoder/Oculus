import validate, { isEmail, toTrimmedString } from '../utils/validator.js';

const validateRegisterInput = (body) => {
    const errors = [];
    const value = {
        email: toTrimmedString(body?.email).toLowerCase(),
        password: typeof body?.password === 'string' ? body.password : '',
        name: toTrimmedString(body?.name)
    };

    if (!isEmail(value.email)) {
        errors.push('Email must be a valid email address.');
    }

    if (value.password.length < 12) {
        errors.push('Password must be at least 12 characters.');
    }

    if (value.name.length < 2 || value.name.length > 50) {
        errors.push('Name must be between 2 and 50 characters.');
    }

    return { value, errors };
};

const validateLoginInput = (body) => {
    const errors = [];
    const value = {
        email: toTrimmedString(body?.email).toLowerCase(),
        password: typeof body?.password === 'string' ? body.password : ''
    };

    if (!isEmail(value.email)) {
        errors.push('Email must be a valid email address.');
    }

    if (!value.password) {
        errors.push('Password is required.');
    }

    return { value, errors };
};

const validateRegister = validate(validateRegisterInput);
const validateLogin = validate(validateLoginInput);
export {
    validateRegister,
    validateLogin
};