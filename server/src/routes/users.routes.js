const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

const controllerUsers = require('../controllers/users.controller');

router.post('/api/register', asyncHandler(controllerUsers.register));
router.post('/api/login', asyncHandler(controllerUsers.login));
router.post('/api/login-google', asyncHandler(controllerUsers.loginGoogle));
router.get('/api/auth', authUser, asyncHandler(controllerUsers.authUser));
router.get('/api/logout', authUser, asyncHandler(controllerUsers.logout));
router.get('/api/refresh-token', asyncHandler(controllerUsers.refreshToken));
router.post('/api/change-password', authUser, asyncHandler(controllerUsers.changePassword));
router.post('/api/send-mail-forgot-password', asyncHandler(controllerUsers.sendMailForgotPassword));
router.post('/api/reset-password', asyncHandler(controllerUsers.verifyOtp));

router.get('/api/get-admin-stats', authAdmin, asyncHandler(controllerUsers.getAdminStats));
router.get('/api/get-all-users', authAdmin, asyncHandler(controllerUsers.getAllUser));

router.get('/api/admin', authAdmin, (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'ok',
    });
});

module.exports = router;
