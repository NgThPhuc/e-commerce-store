const modelCart = require('../models/cart.model');
const modelProduct = require('../models/product.models');

const { BadRequestError } = require('../core/error.response');
const { OK } = require('../core/success.response');

class controllerCart {
    async addCart(req, res) {
        const { productId, quantity } = req.body;
        const { id } = req.user;
        const findProduct = await modelProduct.findById(productId);
        if (!findProduct) {
            throw new BadRequestError('Không tìm thấy sản phẩm');
        }
        if (quantity > findProduct.stock) {
            throw new BadRequestError('Số lượng trong kho không đủ');
        }
        const findCart = await modelCart.findOne({ userId: id });

        const totalPriceProduct = findProduct.price * quantity;

        if (!findCart) {
            const newCart = await modelCart.create({
                userId: id,
                product: [{ productId, quantity }],
                totalPrice: totalPriceProduct,
            });

            await newCart.save();

            await modelProduct.updateOne({ _id: productId }, { $inc: { stock: -quantity } });

            new OK({ message: 'Thêm sản phẩm vào giỏ hàng thành công', metadata: findCart }).send(res);
        } else {
            findCart.product.push({ productId, quantity });
            findCart.totalPrice += totalPriceProduct;
            await findCart.save();

            await modelProduct.updateOne({ _id: productId }, { $inc: { stock: -quantity } });
            new OK({ message: 'Thêm sản phẩm vào giỏ hàng thành công', metadata: findCart }).send(res);
        }
    }

    async getCart(req, res) {
        try {
            const { id } = req.user;
            const cart = await modelCart.findOne({ userId: id });
            
            // If cart doesn't exist, return empty data instead of throwing error
            if (!cart) {
                return new OK({ 
                    message: 'Giỏ hàng trống', 
                    metadata: { 
                        newData: {
                            data: [],
                            totalPrice: 0
                        }
                    } 
                }).send(res);
            }

            // Use try-catch for each product to handle cases where products might be deleted
            const data = await Promise.all(
                cart.product.map(async (item) => {
                    try {
                        const product = await modelProduct.findById(item.productId);
                        if (!product) {
                            // If product not found, return minimal info to avoid breaking the UI
                            return { 
                                _id: item.productId, 
                                name: "Sản phẩm không tồn tại", 
                                price: 0, 
                                images: [], 
                                quantity: item.quantity 
                            };
                        }
                        return { ...product._doc, quantity: item.quantity };
                    } catch (error) {
                        // Handle any errors with individual products
                        return { 
                            _id: item.productId, 
                            name: "Sản phẩm không tồn tại", 
                            price: 0, 
                            images: [], 
                            quantity: item.quantity 
                        };
                    }
                }),
            );

            const newData = {
                data,
                totalPrice: cart.totalPrice,
                fullName: cart.fullName || '',
                phone: cart.phone || '',
                address: cart.address || ''
            };
            
            new OK({ message: 'Thành công', metadata: { newData } }).send(res);
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error in getCart:", error);
            new OK({ 
                message: 'Có lỗi xảy ra', 
                metadata: { 
                    newData: {
                        data: [],
                        totalPrice: 0
                    }
                } 
            }).send(res);
        }
    }

    async deleteProductCart(req, res) {
        try {
            const { id } = req.user;
            const { productId } = req.query;

            const cart = await modelCart.findOne({ userId: id });
            if (!cart) {
                throw new BadRequestError('Không tìm thấy giỏ hàng');
            }

            const product = await modelProduct.findById(productId);
            if (!product) {
                throw new BadRequestError('Không tìm thấy sản phẩm');
            }

            const index = cart.product.findIndex((item) => item.productId.toString() === productId);
            if (index === -1) {
                throw new BadRequestError('Không tìm thấy sản phẩm trong giỏ hàng');
            }

            // Lưu lại số lượng sản phẩm trước khi xoá
            const removedProduct = cart.product[index];

            // Cập nhật totalPrice trước khi xoá sản phẩm
            cart.totalPrice -= product.price * removedProduct.quantity;

            // Xoá sản phẩm khỏi giỏ hàng
            cart.product.splice(index, 1);

            await cart.save();

            // Cập nhật lại số lượng tồn kho
            await modelProduct.updateOne({ _id: productId }, { $inc: { stock: removedProduct.quantity } });

            new OK({ message: 'Xoá thành công', metadata: cart }).send(res);
        } catch (error) {
            new BadRequestError(error.message).send(res);
        }
    }

    async updateInfoUserCart(req, res) {
        const { id } = req.user;
        const { fullName, phone, address } = req.body;
        const cart = await modelCart.findOne({ userId: id });
        if (!cart) {
            throw new BadRequestError('Không tìm thấy giỏ hàng');
        }
        cart.fullName = fullName;
        cart.phone = phone;
        cart.address = address;
        await cart.save();
        new OK({ message: 'Thành công', metadata: cart }).send(res);
    }
}

module.exports = new controllerCart();
