import ApiError from '../utils/apiError.js';

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        // Extract all validation failure messages into an array
        const errorDetails = error.details.map(detail => detail.message);
        
        // Pass to global error handler via next()
        return next(new ApiError(400, "Validation Failed", errorDetails));
    }
    
    next();
};

export default validate;