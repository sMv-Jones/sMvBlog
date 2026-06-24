import Post from '../models/post.js';
import Profile from "../models/profile.js"
import domPurify from "../utils/domPurify.js";
import { uploadToAzure, deleteFromAzure } from '../configs/azureStorage.js';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvwxyz0123456789',
    10
);

const buildTimeFilter = (timeframe) => {
    const allowedTimeframes = ['1day', '1week', '1month', '1year'];
    if (!timeframe || !allowedTimeframes.includes(timeframe)) return null;

    const now = new Date();
    if (timeframe === '1day') return { $gte: new Date(now - 24 * 60 * 60 * 1000) };
    if (timeframe === '1week') return { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
    if (timeframe === '1month') return { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
    if (timeframe === '1year') return { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };

    return null;
};

export const createPost = async (req, res, next) => {
    try {
        let { title, slug, content, status } = req.body;

        if (!req.file) {
            res.status(400);
            throw new Error("Please upload an image file");
        }

        content = domPurify(content);

        // Generate clean, secure colliding-proof unique slug syntax values
        const cleanSlug = slug ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '') : title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const uniqueSlug = `${nanoid()}-${cleanSlug}`.substring(0, 45);

        const imageUrl = await uploadToAzure(req.file);
        const post = await Post.create({
            title,
            slug: uniqueSlug,
            content,
            status,
            featuredImage: imageUrl,
            userId: req.user.id,
            userName: req.user.userName,
            displayName: req.user.displayName
        });
        await Profile.findOneAndUpdate(
            { userName: req.user.userName },
            { $inc: { postCount: 1 } }, // Force -1
            { returnDocument: 'after' }
        );
        // Cleaned Response: Convert document to plain object and remove internal __v field
        const postResponse = post.toObject();
        delete postResponse.__v;

        res.status(201).json(postResponse);
    } catch (error) { next(error); }
};

export const updatePost = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const post = await Post.findOne({ slug });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized operation" });
        }

        // Whitelist explicitly allowed parameters to block injections
        const updateData = {};
        if (req.body.title) updateData.title = req.body.title;
        if (req.body.status) updateData.status = req.body.status;
        if (req.body.content) updateData.content = domPurify(req.body.content);

        if (req.body.slug) {
            const cleanSlug = req.body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
            updateData.slug = `${nanoid()}-${cleanSlug}`.substring(0, 45);
        }

        if (req.file) {
            await deleteFromAzure(post.featuredImage);
            updateData.featuredImage = await uploadToAzure(req.file);
        }

        // Cleaned Response: Stripped out database version flag using `.select('-__v')`
        const updatedPost = await Post.findByIdAndUpdate(
            post._id,
            { $set: updateData },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).select('-__v');

        res.json(updatedPost);
    } catch (error) { next(error); }
};

export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized operation" });
        }

        await deleteFromAzure(post.featuredImage);
        await post.deleteOne();
        await Profile.findOneAndUpdate(
            { userName: req.user.userName },
            { $inc: { postCount: -1 } }, // Force -1
            { returnDocument: 'after' }
        );

        res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) { next(error); }
};

export const getPost = async (req, res, next) => {
    try {
        // Cleaned Response: Project out __v from structural layout
        const post = await Post.findOne({ slug: req.params.slug }).select('-__v');
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error) { next(error); }
};

export const getPosts = async (req, res, next) => {
    try {
        let { userName, time } = req.query;
        const filter = { status: "active" };

        // Sanitize and validate userName parameter
        if (userName) {
            userName = String(userName).trim();
            if (/^[a-zA-Z0-9_-]+$/.test(userName)) {
                filter.userName = userName;
            } else {
                return res.status(400).json({ message: "Invalid username format" });
            }
        }

        // Validate and apply timeframe query
        const timeQuery = buildTimeFilter(time);
        if (timeQuery) {
            filter.createdAt = timeQuery;
        }

        const posts = await Post.find(filter)
            .select('-__v')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) { next(error); }
};

// 2. Updated: Handled parameters for personal post tracking
export const getMyPosts = async (req, res, next) => {
    try {
        const { time } = req.query;
        const filter = { userId: req.user.id };

        // Validate and apply timeframe query
        const timeQuery = buildTimeFilter(time);
        if (timeQuery) {
            filter.createdAt = timeQuery;
        }

        const posts = await Post.find(filter)
            .select('-__v')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) { next(error); }
};
