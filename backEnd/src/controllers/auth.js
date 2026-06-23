import User from '../models/user.js';
import crypto from 'crypto';
import OTP from "../models/otp.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateUsername from '../utils/uuid.js';

// Helper to generate JWT and issue an HTTP-only Cookie
const generateTokenAndSetCookie = (res, userId, userName, displayName) => {
    const token = jwt.sign({ userId, userName, displayName }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};
const generateOTPCookie = (res, email) => {
    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
    );
    res.cookie('OTP', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 5 * 60 * 1000 + 20 * 1000
    });
}
export const registerUser = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const otp = crypto.randomInt(100000, 1000000).toString();
        generateOTPCookie(res, email);
        const hashedPassword = await bcrypt.hash(password, 10);
        await OTP.deleteMany({ email });
        await OTP.create({
            email,
            otp,
            data: { email, password: hashedPassword, name }
        });
        res.status(201).json({
            success: true,
        });
    } catch (error) { next(error); }
};

export const verfiyRegister = async (req, res, next) => {
    try {
        const email = req.user.email;
        const userOTP = req.body.otp;
        const otpRecord = await OTP.findOne({ email });
        console.log("UserOTP : ",userOTP);
        if (!otpRecord) {
            res.status(404);
            throw new Error('OTP expired or not found');
        }
        if (otpRecord.otp !== req.body.otp) {
            throw new Error('Invalid OTP');
        }

        if (String(userOTP) !== String(otpRecord.otp)) {
            res.status(401);
            throw new Error('Invalid OTP');
        }

        const userData = otpRecord.data;

        const userName = generateUsername(userData.name);

        const user = await User.create({
            displayName: userData.name,
            userName,
            email: userData.email,
            password: userData.password,
        });

        await OTP.deleteOne({ _id: otpRecord._id });

        generateTokenAndSetCookie(
            res,
            user._id,
            user.userName,
            user.displayName
        );
        res.clearCookie("OTP", {
            httpOnly: true,
            secure: true || process.env.NODE_ENV === 'production',
            sameSite: "none" // Set to "none" if cross-site, matching your setter config
        });
        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                displayName: user.displayName,
                userName: user.userName,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const verfiyOTP = async () => {

};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            generateTokenAndSetCookie(res, user._id, user.userName, user.displayName);
            // Explicit payload normalization
            res.json({
                success: true,
                user: { _id: user._id, displayName: user.displayName, userName: user.userName, email: user.email }
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) { next(error); }
};

export const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true || process.env.NODE_ENV === 'production',
        sameSite: "none" // Set to "none" if cross-site, matching your setter config
    });
    res.json({ success: true, message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res, next) => {
    try {
        // 1. Ensure auth middleware successfully attached user credentials
        if (!req.user || !req.user.id) {
            return res.status(200).json({ success: false, user: null });
        }

        // 2. Fetch data, dropping password fields and Mongoose version __v
        const user = await User.findById(req.user.id).select("-password -__v");

        // 3. Handle token existence but document deletion in DB
        if (!user) {
            return res.status(200).json({ success: false, user: null });
        }

        // IMPROVEMENT: Transform Mongoose document to clean JSON, keeping both id and _id 
        // to prevent field mismatches in components like PostForm
        const userPayload = user.toObject({ virtuals: true });

        // 4. Return structural wrapper identical to login/register payload
        return res.status(200).json({ success: true, user: userPayload });

    } catch (error) {
        next(error);
    }
};