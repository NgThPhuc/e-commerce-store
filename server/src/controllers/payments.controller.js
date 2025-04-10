const modelPayments = require('../models/payments.model');
const modelCart = require('../models/cart.model');
const modelProduct = require('../models/product.models');

const { BadRequestError } = require('../core/error.response');
const { OK } = require('../core/success.response');
const { createToken, createRefreshToken } = require('../services/tokenSevices');

const axios = require('axios');
const crypto = require('crypto');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

class controllerPayments {
    async payment(req, res) {
        const { id } = req.user;
        const { typePayment } = req.body;
        if (!typePayment) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }

        const findCart = await modelCart.findOne({ userId: id });
        if (!findCart) {
            throw new BadRequestError('Không tìm thấy giỏ hàng');
        }
        if (findCart.address === '' || findCart.phone === '' || findCart.fullName === '') {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }
        if (typePayment === 'COD') {
            const newPayment = new modelPayments({
                userId: id,
                products: findCart.product,
                address: findCart.address,
                phone: findCart.phone,
                fullName: findCart.fullName,
                typePayments: 'COD',
                totalPrice: findCart.totalPrice,
                statusOrder: 'pending',
            });
            await newPayment.save();
            await findCart.deleteOne();

            new OK({ message: 'Thanh toán thành công', metadata: newPayment._id }).send(res);
        }
        if (typePayment === 'MOMO') {
            var partnerCode = 'MOMO';
            var accessKey = 'F8BBA842ECF85';
            var secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            var requestId = partnerCode + new Date().getTime();
            var orderId = requestId;
            var orderInfo = `thanh toan ${findCart._id}`; // nội dung giao dịch thanh toán
            var redirectUrl = 'http://localhost:3000/api/check-payment-momo'; // 8080
            var ipnUrl = 'http://localhost:3000/api/check-payment-momo';
            var amount = findCart.totalPrice;
            var requestType = 'captureWallet';
            var extraData = ''; //pass empty value if your merchant does not have stores

            var rawSignature =
                'accessKey=' +
                accessKey +
                '&amount=' +
                amount +
                '&extraData=' +
                extraData +
                '&ipnUrl=' +
                ipnUrl +
                '&orderId=' +
                orderId +
                '&orderInfo=' +
                orderInfo +
                '&partnerCode=' +
                partnerCode +
                '&redirectUrl=' +
                redirectUrl +
                '&requestId=' +
                requestId +
                '&requestType=' +
                requestType;
            //puts raw signature

            //signature
            var signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');

            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                accessKey: accessKey,
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                extraData: extraData,
                requestType: requestType,
                signature: signature,
                lang: 'en',
            });

            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            new OK({ message: 'Thanh toán thông báo', metadata: response.data }).send(res);
        }
        if (typePayment === 'VNPAY') {
            const vnpay = new VNPay({
                tmnCode: 'DH2F13SW',
                secureSecret: 'NXZM3DWFR0LC4R5VBK85OJZS1UE9KI6F',
                vnpayHost: 'https://sandbox.vnpayment.vn',
                testMode: true, // tùy chọn
                hashAlgorithm: 'SHA512', // tùy chọn
                loggerFn: ignoreLogger, // tùy chọn
            });
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            try {
                const vnpayResponse = await vnpay.buildPaymentUrl({
                    vnp_Amount: findCart.totalPrice, //
                    vnp_IpAddr: req.ip || '127.0.0.1', //
                    vnp_TxnRef: findCart._id.toString(),
                    vnp_OrderInfo: `Thanh toan don hang ${findCart._id}`,
                    vnp_OrderType: ProductCode.Other,
                    vnp_ReturnUrl: `http://localhost:3000/api/check-payment-vnpay`, //
                    vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
                    vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
                    vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
                });
                
                // Store user ID in session for later retrieval
                req.session = req.session || {};
                req.session.paymentUserId = id;
                
                new OK({ message: 'Thanh toán thông báo', metadata: vnpayResponse }).send(res);
            } catch (error) {
                console.error('VNPay error:', error);
                throw new BadRequestError('Có lỗi xảy ra khi tạo thanh toán VNPay');
            }
        }
    }

    async checkPaymentMomo(req, res, next) {
        try {
            const { orderId, resultCode } = req.query;
            if (resultCode === '0') {
                const { id } = req.user;
                const findCart = await modelCart.findOne({ userId: id });
                const newPayment = new modelPayments({
                    userId: id,
                    products: findCart.product,
                    address: findCart.address,
                    phone: findCart.phone,
                    fullName: findCart.fullName,
                    typePayments: 'MOMO',
                    totalPrice: findCart.totalPrice,
                    statusOrder: 'pending',
                });
                await newPayment.save();
                await findCart.deleteOne();
                
                // Refresh tokens to ensure continued authentication
                const token = await createToken({ id });
                const refreshToken = await createRefreshToken({ id });
                
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    maxAge: 15 * 60 * 1000, // 15 phút
                });
                
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
                });
                
                return res.redirect('http://localhost:3000/success');
            } else {
                return res.redirect('http://localhost:3000/cancel');
            }
        } catch (error) {
            next(error);
        }
    }

    async checkPaymentVnpay(req, res) {
        try {
            const { vnp_ResponseCode, vnp_TxnRef } = req.query;
            
            // Get the user ID from the transaction reference (cart ID)
            const cartId = vnp_TxnRef;
            const findCart = await modelCart.findById(cartId);
            
            if (!findCart) {
                console.error('Cart not found for transaction:', cartId);
                return res.redirect('http://localhost:3000/cancel?error=cart_not_found');
            }
            
            const userId = findCart.userId;
            
            if (vnp_ResponseCode === '00') {
                try {
                    const newPayment = new modelPayments({
                        userId: userId,
                        products: findCart.product,
                        address: findCart.address,
                        phone: findCart.phone,
                        fullName: findCart.fullName,
                        typePayments: 'VNPAY',
                        totalPrice: findCart.totalPrice,
                        statusOrder: 'pending',
                    });
                    await newPayment.save();
                    await findCart.deleteOne();
                    
                    return res.redirect('http://localhost:3000/success');
                } catch (error) {
                    console.error('Error saving payment:', error);
                    return res.redirect('http://localhost:3000/cancel?error=payment_save_failed');
                }
            } else {
                return res.redirect(`http://localhost:3000/cancel?code=${vnp_ResponseCode}`);
            }
        } catch (error) {
            console.error('VNPay callback error:', error);
            return res.redirect('http://localhost:3000/cancel?error=server_error');
        }
    }

    async getHistoryOrder(req, res) {
        const { id } = req.user;
        const payments = await modelPayments.find({ userId: id });

        const orders = await Promise.all(
            payments.map(async (order) => {
                const products = await Promise.all(
                    order.products.map(async (item) => {
                        const product = await modelProduct.findById(item.productId);

                        if (!product) {
                            return {
                                productId: item.productId,
                                name: 'Sản phẩm không còn tồn tại',
                                image: '',
                                price: 0,
                                quantity: item.quantity,
                                status: 'deleted',
                            };
                        }

                        let productDetails = {
                            productId: product._id,
                            name: product.name,
                            image: product.images[0],
                            price: product.price,
                            quantity: item.quantity,
                            category: product.category,
                            gender: product.gender,
                            brand: product.attributes?.brand || '',
                            status: 'active',
                        };

                        if (['ao', 'quan', 'vay', 'dam'].includes(product.category)) {
                            productDetails = {
                                ...productDetails,
                                size: product.attributes?.size || '',
                                color: product.attributes?.color || '',
                                material: product.attributes?.material || '',
                            };
                        } else if (product.category === 'giay_dep') {
                            productDetails = {
                                ...productDetails,
                                size: product.attributes?.size || '',
                                color: product.attributes?.color || '',
                            };
                        } else if (['phu_kien', 'tui_xach'].includes(product.category)) {
                            productDetails = {
                                ...productDetails,
                                color: product.attributes?.color || '',
                                material: product.attributes?.material || '',
                            };
                        }

                        return productDetails;
                    }),
                );

                return {
                    orderId: order._id,
                    fullName: order.fullName,
                    phone: order.phone,
                    address: order.address,
                    totalPrice: order.totalPrice,
                    typePayments: order.typePayments,
                    statusOrder: order.statusOrder,
                    createdAt: order.createdAt,
                    products,
                    paymentStatus: order.typePayments === 'COD' ? 'Thanh toán khi nhận hàng' : 'Đã thanh toán',
                };
            }),
        );

        new OK({
            message: 'Thành công',
            metadata: {
                orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            },
        }).send(res);
    }

    async getOnePayment(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) {
                throw new BadRequestError('Không tìm thấy đơn hàng');
            }

            const findPayment = await modelPayments.findById(id);

            if (!findPayment) {
                throw new BadRequestError('Không tìm thấy đơn hàng');
            }

            const dataProduct = await Promise.all(
                findPayment.products.map(async (item) => {
                    const product = await modelProduct.findById(item.productId);
                    return {
                        product: product,
                        quantity: item.quantity,
                    };
                }),
            );
            const data = { findPayment, dataProduct };

            new OK({ message: 'Thành công', metadata: data }).send(res);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async filterOrder(req, res, next) {
        try {
            const { statusOrder } = req.query;
            const payments = statusOrder ? await modelPayments.find({ statusOrder }) : await modelPayments.find();

            const orders = await Promise.all(
                payments.map(async (order) => {
                    const products = await Promise.all(
                        order.products.map(async (item) => {
                            const product = await modelProduct.findById(item.productId);
                            if (!product) {
                                return {
                                    productId: item.productId,
                                    name: 'Sản phẩm không tồn tại',
                                    image: '',
                                    price: 0,
                                    quantity: item.quantity,
                                };
                            }
                            return {
                                productId: product._id,
                                name: product.name,
                                image: product.images[0],
                                price: product.price,
                                quantity: item.quantity,
                            };
                        }),
                    );

                    return {
                        orderId: order._id,
                        fullName: order.fullName,
                        phone: order.phone,
                        address: order.address,
                        totalPrice: order.totalPrice,
                        typePayments: order.typePayments,
                        statusOrder: order.statusOrder,
                        createdAt: order.createdAt,
                        products,
                    };
                }),
            );

            new OK({ message: 'Thành công', metadata: { orders } }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async updateStatusOrder(req, res, next) {
        const { statusOrder, orderId } = req.body;
        const findPayment = await modelPayments.findById(orderId);
        if (!findPayment) {
            throw new BadRequestError('Không tìm thấy đơn hàng');
        }
        findPayment.statusOrder = statusOrder;
        await findPayment.save();
        new OK({ message: 'Thành công', metadata: findPayment }).send(res);
    }
}

module.exports = new controllerPayments();
