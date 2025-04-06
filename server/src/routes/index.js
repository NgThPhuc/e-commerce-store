const userRoutes = require('./users.routes');
const productRoutes = require('./products.routes');
const cartRoutes = require('./cart.routes');
const paymentRoutes = require('./payments.routes');
const blogRoutes = require('./blogs.routes');
const contactRoutes = require('./contact.routes');

function routes(app) {
    app.post('/api/register', userRoutes);
    app.post('/api/login', userRoutes);
    app.post('/api/login-google', userRoutes);
    app.get('/api/auth', userRoutes);
    app.get('/api/logout', userRoutes);
    app.get('/api/refresh-token', userRoutes);
    app.post('/api/change-password', userRoutes);
    app.get('/api/get-admin-stats', userRoutes);
    app.get('/api/get-all-users', userRoutes);
    app.post('/api/send-mail-forgot-password', userRoutes);
    app.post('/api/reset-password', userRoutes);

    /// product
    app.post('/api/create-product', productRoutes);
    app.post('/api/upload-image', productRoutes);
    app.get('/api/products', productRoutes);
    app.get('/api/product', productRoutes);
    app.get('/api/filter-products', productRoutes);
    app.get('/api/get-all-products', productRoutes);
    app.post('/api/edit-product', productRoutes);
    app.delete('/api/delete-product', productRoutes);

    /// cart
    app.post('/api/add-cart', cartRoutes);
    app.get('/api/get-cart', cartRoutes);
    app.delete('/api/delete-product-cart', cartRoutes);
    app.post('/api/update-info-user-cart', cartRoutes);

    //// payments
    app.post('/api/payments', paymentRoutes);
    app.get('/api/check-payment-momo', paymentRoutes);
    app.get('/api/check-payment-vnpay', paymentRoutes);
    app.get('/api/get-payment', paymentRoutes);
    app.get('/api/get-one-payment', paymentRoutes);
    app.get('/api/get-all-order', paymentRoutes);
    app.post('/api/update-status-order', paymentRoutes);

    /// blogs
    app.post('/api/create-blog', blogRoutes);
    app.get('/api/blogs', blogRoutes);
    app.get('/api/blog', blogRoutes);
    app.delete('/api/delete-blog', blogRoutes);

    /// contact
    app.post('/api/create-contact', contactRoutes);
    app.get('/api/get-contact', contactRoutes);
    app.post('/api/reply-contact', contactRoutes);

    app.get('/api/admin', userRoutes);
}

module.exports = routes;
