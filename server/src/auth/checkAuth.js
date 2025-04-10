const { BadUserRequestError, BadUser2RequestError } = require('../core/error.response');
const { verifyToken, createToken } = require('../services/tokenSevices');
const modelUser = require('../models/users.model');
const modelApiKey = require('../models/apiKey.model');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const refreshToken = req.cookies.refreshToken;
        
        if (!token) {
            if (!refreshToken) {
                throw new BadUserRequestError('Vui lòng đăng nhập');
            }
            
            // Try to refresh the token
            try {
                const decoded = await verifyToken(refreshToken);
                const newToken = await createToken({ id: decoded.id });
                
                res.cookie('token', newToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    maxAge: 15 * 60 * 1000, // 15 phút
                });
                
                req.user = { id: decoded.id };
                next();
                return;
            } catch (refreshError) {
                throw new BadUserRequestError('Vui lòng đăng nhập lại');
            }
        }
        
        try {
            const decoded = await verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            // Token is invalid, try to use refresh token
            if (!refreshToken) {
                throw new BadUserRequestError('Vui lòng đăng nhập lại');
            }
            
            try {
                const decoded = await verifyToken(refreshToken);
                const newToken = await createToken({ id: decoded.id });
                
                res.cookie('token', newToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    maxAge: 15 * 60 * 1000, // 15 phút
                });
                
                req.user = { id: decoded.id };
                next();
            } catch (refreshError) {
                throw new BadUserRequestError('Vui lòng đăng nhập lại');
            }
        }
    } catch (error) {
        next(error);
    }
};

const authAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const refreshToken = req.cookies.refreshToken;
        
        // If no token is present at all
        if (!token && !refreshToken) {
            throw new BadUserRequestError('Bạn không có quyền truy cập');
        }
        
        // First try with access token
        if (token) {
            try {
                const decoded = await verifyToken(token);
                const { id } = decoded;
                const findUser = await modelUser.findById(id);
                
                if (!findUser) {
                    throw new BadUserRequestError('Không tìm thấy người dùng');
                }
                
                if (findUser.isAdmin === false) {
                    throw new BadUser2RequestError('Bạn không có quyền truy cập');
                }
                
                req.user = decoded;
                return next();
            } catch (tokenError) {
                // If access token fails, don't throw yet - try refresh token
                console.log("Access token verification failed, trying refresh token");
                
                // Only throw if there's no refresh token available
                if (!refreshToken) {
                    throw new BadUserRequestError('Bạn không có quyền truy cập');
                }
            }
        }
        
        // Try with refresh token if access token failed or isn't present
        try {
            const decoded = await verifyToken(refreshToken);
            const { id } = decoded;
            const findUser = await modelUser.findById(id);
            
            if (!findUser) {
                throw new BadUserRequestError('Không tìm thấy người dùng');
            }
            
            if (findUser.isAdmin === false) {
                throw new BadUser2RequestError('Bạn không có quyền truy cập');
            }
            
            // Create new access token
            const newToken = await createToken({ id });
            
            // Set new access token cookie
            res.cookie('token', newToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            
            req.user = { id };
            return next();
        } catch (refreshError) {
            throw new BadUserRequestError('Bạn không có quyền truy cập');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    asyncHandler,
    authUser,
    authAdmin,
};
