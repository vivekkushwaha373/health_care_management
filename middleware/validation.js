const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};



const userValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

const patientValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),
    body('dateOfBirth')
        .isISO8601()
        .withMessage('Please provide a valid date of birth'),
    body('gender')
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),
    handleValidationErrors
];

const doctorValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),
    body('specialization')
        .trim()
        .notEmpty()
        .withMessage('Specialization is required'),
    body('licenseNumber')
        .trim()
        .notEmpty()
        .withMessage('License number is required'),
    body('experience')
        .isInt({ min: 0 })
        .withMessage('Experience must be a positive integer'),
    body('qualification')
        .trim()
        .notEmpty()
        .withMessage('Qualification is required'),
    handleValidationErrors
];

module.exports = {
    userValidation,
    patientValidation,
    doctorValidation,
    handleValidationErrors
};