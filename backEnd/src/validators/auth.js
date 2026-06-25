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
    body('bio')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),

    body('socialLinks.github')
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage('GitHub link must be a valid URL structure')
        .custom((value) => {
            const isGithub = /^(https?:\/\/)?(www\.)?github\.com/i.test(value);
            if (!isGithub) {
                throw new Error('Must be a valid GitHub profile link');
            }
            return true;
        }),

    body('socialLinks.linkedin')
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage('LinkedIn link must be a valid URL structure')
        .custom((value) => {
            const isLinkedin = /^(https?:\/\/)?(www\.)?linkedin\.com/i.test(value);
            if (!isLinkedin) {
                throw new Error('Must be a valid LinkedIn profile link');
            }
            return true;
        })
];

export const changePasswordValidator = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required.'),

    body('newPassword')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long.'),

    body('otp')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
        .isNumeric().withMessage('OTP must contain numbers only.'),

];

export const deleteAccountValidator = [
    body('otp')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
        .isNumeric().withMessage('OTP must contain numbers only.'),

];

export const verifyOtpValidation = [
    body('otp')
        .matches(/^\d{6}$/)
        .withMessage('OTP must be a 6-digit number'),
];

export const forgotPasswordValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email address is required.')
        .isEmail().withMessage('Please provide a valid email structure.')
        .normalizeEmail(),
];

export const resetPasswordValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email address context identifier missing.')
        .isEmail().withMessage('Invalid email routing metadata.'),

    body('otp')
        .trim()
        .notEmpty().withMessage('Verification code is required.')
        .isLength({ min: 6, max: 6 }).withMessage('Security OTP code must be exactly 6 digits.')
        .isNumeric().withMessage('Security OTP must contain only numeric digits.'),

    body('newPassword')
        .trim()
        .notEmpty().withMessage('Please enter your new password.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/[A-Z]/).withMessage('Password requires at least one uppercase letter.')
        .matches(/[a-z]/).withMessage('Password requires at least one lowercase letter.')
        .matches(/[0-9]/).withMessage('Password requires at least one numeric value.'),
];