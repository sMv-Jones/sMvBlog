import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 
    });
};

export const registerUser = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({ name, email, password });

        generateTokenAndSetCookie(res, user._id);
        res.status(201).json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) { next(error); }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            generateTokenAndSetCookie(res, user._id);
            res.json({
                success: true,
                user: { _id: user._id, name: user.name, email: user.email }
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict"
    });
    res.json({ success: true, message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(401);
            throw new Error('User not logged in');
        }
        res.json(user);
    } catch (error) { next(error); }
};