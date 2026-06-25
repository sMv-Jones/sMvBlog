import express from 'express';
import * as postCtrl from '../controllers/post.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../configs/azureStorage.js';
import { createPostValidation, updatePostValidation } from '../validators/post.js';
import { validate } from '../middlewares/validate.js';
import { userApiLimiter } from '../middlewares/rateLimiter.js';
const router = express.Router();

router.get('/my-posts', protect, userApiLimiter, postCtrl.getMyPosts);
router.get('/', protect, userApiLimiter, postCtrl.getPosts);
router.get('/:slug', protect, userApiLimiter, postCtrl.getPost);

router.post('/', protect, userApiLimiter, upload.single('image'), createPostValidation, validate, postCtrl.createPost);
router.put('/:slug', protect, userApiLimiter, upload.single('image'), updatePostValidation, validate, postCtrl.updatePost);
router.delete('/:slug', protect, userApiLimiter, postCtrl.deletePost);

export default router;