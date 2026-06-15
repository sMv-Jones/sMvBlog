import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        res.status(401);
        next(new Error('Not authorized, token validation failed'));
    }
};