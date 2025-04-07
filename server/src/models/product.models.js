const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Tên sản phẩm
        category: {
            type: String,
            required: true,
            enum: ['model_kit', 'metal_build', 'figure', 'dung_cu', 'phu_kien'],
        }, // Loại sản phẩm: Model Kit, Metal Build, Figure, Dụng cụ, Phụ kiện
        brand: {
            type: String,
            required: true,
            enum: ['bandai', 'moshow', 'dragon', 'tamiya', 'other'],
        }, // Thương hiệu: Bandai, Moshow, Dragon, Tamiya, Other
        price: { type: Number, required: true }, // Giá
        stock: { type: Number, default: 0 }, // Số lượng tồn kho
        description: { type: String }, // Mô tả sản phẩm
        images: [{ type: String }], // Danh sách URL hình ảnh
        attributes: {
            type: Map,
            of: String,
            default: {
                scale: '', // Tỷ lệ: 1/144, 1/100, 1/60, etc.
                series: '', // Series: Gundam, Dragon Ball, etc.
                grade: '', // Grade: HG, RG, MG, PG (cho Model Kit)
                material: '', // Chất liệu
            },
        }, // Thuộc tính sản phẩm
    },
    { timestamps: true },
);

module.exports = mongoose.model('products', productSchema);
