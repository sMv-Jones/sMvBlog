import crypto from 'crypto';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';


import generateUsername from '../utils/uuid.js';

import emailSender from "../utils/email.js"


import Profile from '../models/profile.js';

import User from '../models/user.js';

import OTP from "../models/otp.js"

import otpTemplate from '../utils/emailTemplate.js';


import { uploadToAzure, deleteFromAzure } from '../configs/azureStorage.js';


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

export const getRandomProfilePhoto = () => {

    const randomNumber = Math.floor(Math.random() * 9);


    return `profilePhoto_${String(randomNumber).padStart(2, "0")}.png`;

};


export const registerUser = async (req, res, next) => {

    try {

        const { email, password, name } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {

            res.status(400);

            throw new Error('User already exists');

        }


        const otp = crypto.randomInt(100000, 1000000).toString();

        await emailSender(

            email,

            "Verify Your Email Address",

            otpTemplate(

                "Verify Your Email",

                "Thank you for registering with sMv|Blog. Use the OTP below to verify your email address.",

                otp

            )

        );

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


        const createProfile = await Profile.create({

            userName: user.userName,

            displayName: user.displayName,

            email: user.email,

            profilePhoto: getRandomProfilePhoto()

        }

        );


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

        console.log(error.message)

        next(error);

    }

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

        if (!req.user.id) {

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



export const getProfile = async (req, res, next) => {

    try {

        if (!req.user?.id) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized Access! Login please."

            });

        }


        const userName = req.query.userName || req.user.userName;


        const profile = await Profile.findOne({ userName })

            .select("-_id -__v");


        if (!profile) {

            return res.status(404).json({

                success: false,

                message: "Page Not Found! Check userName."

            });

        }


        return res.status(200).json({

            success: true,

            profile

        });


    } catch (error) {

        next(error);

    }

};


export const updateProfile = async (req, res, next) => {

    try {

        const userName = req.user?.userName;

        const id = req.user?.id;


        if (!userName || !id) {

            return res.status(400).json({

                success: false,

                message: "User context identification missing."

            });

        }


        // Fetch the profile belonging to the authenticated user

        let profile = await Profile.findOne({ userName });

        // 💡 FIX: Fixed typo "exit" -> "exist"

        if (!profile) {

            return res.status(404).json({

                success: false,

                message: "Profile does not exist."

            });

        }


        // 💡 REMOVED REDUNDANCY:

        // "if (profile.userName !== userName)" is redundant here because

        // findOne({ userName }) guarantees they match!


        // 1. Process text fields parsed by multer/body-parser

        if (req.body.bio !== undefined) profile.bio = req.body.bio;


        if (req.body.socialLinks) {

            profile.socialLinks = {

                github: req.body.socialLinks.github || '',

                linkedin: req.body.socialLinks.linkedin || ''

            };

        }


        // 2. Process File Upload if provided

        if (req.file) {

            const oldPhotoUrl = profile.profilePhoto;


            // Upload new file buffer directly to Azure container

            const newPhotoUrl = await uploadToAzure({

                buffer: req.file.buffer,

                mimetype: req.file.mimetype,

                originalname: req.file.originalname

            });


            // Update database pointer

            profile.profilePhoto = newPhotoUrl;


            // Delete old photo if it's hosted in Azure and isn't a placeholder default string

            if (oldPhotoUrl && !oldPhotoUrl.startsWith('profilePhoto')) {

                await deleteFromAzure(oldPhotoUrl);

            }

        }


        await profile.save();


        return res.status(200).json({

            success: true,

            profile

        });


    } catch (error) {

        console.error("Profile Update Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Failed to update profile configurations."

        });

    }

};

export const sendPasswordOtp = async (req, res, next) => {
    try {
        const userName = req.user?.userName;
        if (!userName) {
            res.status(401);
            throw new Error("Unauthorized! Valid session context missing.");
        }

        // 🔍 Fetch user's email from database using userName from JWT
        const user = await User.findOne({ userName });
        if (!user) {
            res.status(404);
            throw new Error("User account not found.");
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        // Overwrite old OTPs for this email, keeping 'data' as an empty object
        await OTP.deleteMany({ email: user.email });
        await OTP.create({
            email: user.email,
            otp,
            data: {} // 💡 Satisfies required: true validation while keeping data clean/empty
        });

        await emailSender(
            user.email,
            "Password Reset Verification",
            otpTemplate(
                "Reset Your Password",
                "We received a request to change your account password. Use the OTP below to proceed safely.",
                otp
            )
        );

        res.status(200).json({ success: true, message: "Security token dispatched to registered email." });
    } catch (error) { next(error); }
};

/**
 * 2. CHANGE PASSWORD
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, otp } = req.body;
        const userName = req.user?.userName;

        const user = await User.findOne({ userName }).select('+password');
        if (!user) {
            res.status(404);
            throw new Error("User account not found.");
        }

        // Validate operational configuration security token
        const otpRecord = await OTP.findOne({ email: user.email });
        if (!otpRecord || otpRecord.otp !== String(otp)) {
            res.status(400);
            throw new Error("Invalid or expired operational token code.");
        }

        // Check password match using model methods
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            res.status(401);
            throw new Error("Current password provided is incorrect.");
        }

        // Set the new unhashed password string (your userSchema pre-save hook handles hashing!)
        user.password = newPassword;
        await user.save();

        // Clear verification traces
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ success: true, message: "Security credentials updated successfully." });
    } catch (error) { next(error); }
};

/**
 * 3. DISPATCH ACCOUNT DELETION OTP
 * Looks up the email via req.user.userName, passes {} to data
 */
export const sendDeleteAccountOtp = async (req, res, next) => {
    try {
        const userName = req.user?.userName;
        if (!userName) {
            res.status(401);
            throw new Error("Unauthorized! Valid session context missing.");
        }

        const user = await User.findOne({ userName });
        if (!user) {
            res.status(404);
            throw new Error("User account not found.");
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        await OTP.deleteMany({ email: user.email });
        await OTP.create({
            email: user.email,
            otp,
            data: {} // 💡 Kept empty to satisfy model definitions
        });

        await emailSender(
            user.email,
            "Account Deletion Verification",
            otpTemplate(
                "Confirm Account Deletion",
                "You requested to permanently delete your sMv|Blog account. Use the OTP below to finalize this transaction.",
                otp
            )
        );

        res.status(200).json({ success: true, message: "Deletion token context dispatched safely." });
    } catch (error) { next(error); }
};

/**
 * 4. DELETE ACCOUNT
 */
export const deleteAccount = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const userName = req.user?.userName;

        const user = await User.findOne({ userName });
        if (!user) {
            res.status(404);
            throw new Error("User record not found.");
        }

        const otpRecord = await OTP.findOne({ email: user.email });
        if (!otpRecord || otpRecord.otp !== String(otp)) {
            res.status(400);
            throw new Error("Invalid conversion parameters or expired system token.");
        }

        // Clean out storage images linked to user profiles if necessary
        const profile = await Profile.findOne({ userName });
        if (profile?.profilePhoto && !profile.profilePhoto.startsWith('profilePhoto')) {
            await deleteFromAzure(profile.profilePhoto);
        }
        if (profile) {
            // 2. Clear the email data field
            profile.email = "";
            profile.isActive = false;
            profile.socialLinks = {
                github: "",
                linkedin: ""
            };
            // 3. Persist the changes back to your database
            await profile.save();
        }
        // Atomic data expunging routine
        await User.deleteOne({ _id: user._id });
        await OTP.deleteOne({ _id: otpRecord._id });

        // Terminate cookie context variables natively 
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        res.status(200).json({ success: true, message: "Account context safely expunged from database." });
    } catch (error) { next(error); }
};

export const requestPasswordResetOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400);
            throw new Error("Email address is required.");
        }

        // 🔍 Verify the account exists prior to dropping codes
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error("No account found with this email address.");
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        // Expunge old records and save the validation context securely
        const normalizedEmail = email.trim().toLowerCase();
        await OTP.deleteMany({ email: normalizedEmail });
        await OTP.create({
            email: normalizedEmail,
            otp,
            data: {}
        });

        // Dispatch verification notification template payload
        await emailSender(
            user.email,
            "Reset Your Account Password",
            otpTemplate(
                "Reset Your Password",
                "We received a request to reset your sMv|Blog account password. Use the verification code below to authorize this update.",
                otp
            )
        );

        res.status(200).json({
            success: true,
            message: "Recovery verification code dispatched to your inbox."
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 6. RESET PASSWORD WITH OTP (FORGOT PASSWORD STEP 2)
 * Validates the verification code matching the email and overwrites the password schema properties.
 */
export const resetPasswordWithOtp = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            res.status(400);
            throw new Error("Missing structural payload fields (email, otp, and newPassword are required).");
        }

        // 🔍 Locate the matching verification data trace
        const normalizedEmail = email.trim().toLowerCase();
        const otpRecord = await OTP.findOne({ email: normalizedEmail });
        if (!otpRecord || otpRecord.otp !== String(otp)) {
            res.status(400);
            throw new Error("Invalid or expired operational security token.");
        }

        // Locate target user configuration space
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error("Target user profile documentation not found.");
        }

        // Set the new password text string directly
        // Your model's pre-save middleware (`userSchema.pre('save')`) will catch and hash this automatically!
        user.password = newPassword;
        await user.save();

        // Clear verification code memory traces
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            success: true,
            message: "Password overwritten successfully. Please return to the login interface."
        });
    } catch (error) {
        next(error);
    }
};