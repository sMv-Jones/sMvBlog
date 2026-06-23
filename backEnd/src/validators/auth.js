import { body } from "express-validator";

export const registerValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name must only contain letters and spaces"),

    body("email")
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/).withMessage("Must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Must contain at least one number")
];

export const loginValidation = [
    body("email")
        .trim()
        .toLowerCase()
        .isEmail().withMessage("Provide a valid login account profile"),
    body('password')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New secure password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one numeric digit')
];

export const emailValidation = [
    body("email")
        .trim()
        .toLowerCase()
        .isEmail().withMessage("Please present a valid email configuration"),
];

export const updateProfileValidator = [
    body('displayName')
        .notEmpty().withMessage('Display name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Display name must be between 2 and 50 characters')
        .trim(),

    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores')
        .trim(),

    body('email')
        .notEmpty().withMessage('Email address connection is required')
        .isEmail().withMessage('Invalid email connection format')
        .normalizeEmail() // Sanitizes email format (lowercase, drops dots where applicable, etc.)
        .trim(),

    body('bio')
        .optional({ checkFalsy: true }) // Allows blank fields without throwing validation exceptions
        .isLength({ max: 300 }).withMessage('Biographical ledger cannot exceed 300 characters')
        .trim(),

    body(['github', 'linkedin'])
        .optional({ checkFalsy: true })
        .isURL().withMessage('Invalid social architecture matrix URL format')
        .trim()
];

export const changePasswordValidator = [
    body('currentPassword')
        .notEmpty().withMessage('Current validation password is required'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New secure password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one numeric digit')
];


export const validateSocialUrl = [
    body('url')
        .trim()
        .notEmpty().withMessage('URL is required')
        .isURL().withMessage('Must be a valid URL structure')
        .custom((value) => {
            const isLinkedin = /^(https?:\/\/)?(www\.)?linkedin\.com/i.test(value);
            const isGithub = /^(https?:\/\/)?(www\.)?github\.com/i.test(value);

            if (!isLinkedin && !isGithub) {
                throw new Error('URL must be either a valid GitHub or LinkedIn link');
            }
            return true;
        })
];

export const verifyOtpValidation = [
  body('otp')
    .matches(/^\d{6}$/)
    .withMessage('OTP must be a 6-digit number'),
];