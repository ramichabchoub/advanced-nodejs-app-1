import { validationResult } from 'express-validator';

// @desc finds the validation errors in the request and returns a json with the errors
const validatorMiddleware = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
        }
        next();
}

export default validatorMiddleware;