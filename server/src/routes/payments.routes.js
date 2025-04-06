const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

const controllerPayments = require('../controllers/payments.controller');

router.post('/api/payments', authUser, asyncHandler(controllerPayments.payment));

router.get('/api/check-payment-momo', asyncHandler(controllerPayments.checkPaymentMomo));
router.get('/api/check-payment-vnpay', asyncHandler(controllerPayments.checkPaymentVnpay));

router.get('/api/get-all-order', authUser, asyncHandler(controllerPayments.filterOrder));

router.get('/api/get-payment', authUser, asyncHandler(controllerPayments.getHistoryOrder));
router.get('/api/get-one-payment', authUser, asyncHandler(controllerPayments.getOnePayment));

router.post('/api/update-status-order', authUser, asyncHandler(controllerPayments.updateStatusOrder));
module.exports = router;
