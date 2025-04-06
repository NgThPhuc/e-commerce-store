const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

var upload = multer({ storage: storage });

const controllerProducts = require('../controllers/products.controller');

router.post('/api/upload-image', upload.array('images'), asyncHandler(controllerProducts.uploadImage));
router.get('/api/products', asyncHandler(controllerProducts.getProduct));
router.get('/api/product', asyncHandler(controllerProducts.getOneProduct));
router.get('/api/filter-products', asyncHandler(controllerProducts.filterProducts));
router.get('/api/get-all-products', asyncHandler(controllerProducts.getAllProducts));
router.post('/api/edit-product', asyncHandler(controllerProducts.editProduct));

router.post('/api/create-product', authAdmin, upload.array('images'), asyncHandler(controllerProducts.createProduct));
router.delete('/api/delete-product', authAdmin, asyncHandler(controllerProducts.deleteProduct));

module.exports = router;
