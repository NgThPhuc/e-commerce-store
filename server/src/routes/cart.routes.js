const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

const controllerCart = require('../controllers/cart.controller');

router.post('/api/add-cart', authUser, asyncHandler(controllerCart.addCart));
router.get('/api/get-cart', authUser, asyncHandler(controllerCart.getCart));

router.delete('/api/delete-product-cart', authUser, asyncHandler(controllerCart.deleteProductCart));
router.post('/api/update-info-user-cart', authUser, asyncHandler(controllerCart.updateInfoUserCart));

module.exports = router;
