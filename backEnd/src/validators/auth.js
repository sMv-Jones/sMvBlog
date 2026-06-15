import { body } from "express-validator";

export const registerValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    body("email")
        .trim()
        .toLowerCase()
        .isEmail().withMessage("Please present a valid email configuration"),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must scale to at least 8 elements")
];

export const loginValidation = [
    body("email")
        .trim()
        .toLowerCase()
        .isEmail().withMessage("Provide a valid login account profile"),
    body("password")
        .notEmpty().withMessage("Password verification field required")
];