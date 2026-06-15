import Post from '../models/post.js';
import domPurify from "../utils/domPurify.js";
import { uploadToAzure, deleteFromAzure } from '../configs/azureStorage.js';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvwxyz0123456789',
    10
);

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
            userId: req.user.id
        });

        res.status(201).json(post);
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
        // const updatedPost = await Post.findByIdAndUpdate(
        // post._id,
        // { $set: updateData },
        //  { new: true, runValidators: true }
        // );
        const updatedPost = await Post.findByIdAndUpdate(
            post._id,
            { $set: updateData },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

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

        res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) { next(error); }
};

export const getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error) { next(error); }
};

export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ status: "active" }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) { next(error); }
};

export const getMyPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, count: posts.length, posts });
    } catch (error) { next(error); }
};