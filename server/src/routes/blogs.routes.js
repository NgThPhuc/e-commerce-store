const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

router.post('/api/create-blog', authAdmin, asyncHandler(require('../controllers/blogs.controller').createBlog));
router.get('/api/blogs', asyncHandler(require('../controllers/blogs.controller').getAllBlog));
router.get('/api/blog', asyncHandler(require('../controllers/blogs.controller').getOneBlog));
router.delete('/api/delete-blog', authAdmin, asyncHandler(require('../controllers/blogs.controller').deleteBlog));

module.exports = router;
