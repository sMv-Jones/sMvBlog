import express from 'express';
import * as postCtrl from '../controllers/post.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../configs/azureStorage.js';
import { createPostValidation, updatePostValidation } from '../validators/post.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// CRITICAL: Placed general routes above dynamic parameter handlers
router.get('/my-posts', protect, postCtrl.getMyPosts);
router.get('/', postCtrl.getPosts);
router.get('/:slug', postCtrl.getPost);

router.post('/', protect, upload.single('image'), createPostValidation, validate, postCtrl.createPost);
router.put('/:slug', protect, upload.single('image'), updatePostValidation, validate, postCtrl.updatePost);
router.delete('/:slug', protect, postCtrl.deletePost);

export default router;