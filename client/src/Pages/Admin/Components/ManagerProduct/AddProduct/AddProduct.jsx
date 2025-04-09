import classNames from 'classnames/bind';
import styles from './AddProduct.module.scss';
import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Grid,
    Paper,
    Divider,
    Stack,
    IconButton,
    Card,
    CardMedia,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { requestCreateProduct, requestUploadImage } from '../../../../../config/request';

import toast, { Toaster } from 'react-hot-toast';

const cx = classNames.bind(styles);

function AddProduct() {
    const editorRef = useRef(null);
    const [productData, setProductData] = useState({
        name: '',
        category: '',
        brand: '',
        price: '',
        stock: '',
        description: '',
        images: [],
        attributes: {
            scale: '',
            series: '',
            grade: '',
            material: '',
        },
    });

    const categories = [
        { value: 'model_kit', label: 'Model Kit' },
        { value: 'metal_build', label: 'Metal Build' },
        { value: 'figure', label: 'Figure' },
        { value: 'dung_cu', label: 'Dụng cụ' },
        { value: 'phu_kien', label: 'Phụ kiện' },
    ];

    const brands = [
        { value: 'bandai', label: 'Bandai' },
        { value: 'moshow', label: 'Moshow' },
        { value: 'dragon', label: 'Dragon' },
        { value: 'tamiya', label: 'Tamiya' },
        { value: 'other', label: 'Other' },
    ];

    const categoryAttributes = {
        model_kit: [
            { name: 'scale', label: 'Tỷ lệ', type: 'text' },
            { name: 'series', label: 'Series', type: 'text' },
            { name: 'grade', label: 'Grade', type: 'text' },
        ],
        metal_build: [
            { name: 'scale', label: 'Tỷ lệ', type: 'text' },
            { name: 'series', label: 'Series', type: 'text' },
        ],
        figure: [
            { name: 'scale', label: 'Tỷ lệ', type: 'text' },
            { name: 'series', label: 'Series', type: 'text' },
        ],
        dung_cu: [
            { name: 'material', label: 'Chất liệu', type: 'text' },
            { name: 'series', label: 'Series', type: 'text' },
        ],
        phu_kien: [
            { name: 'material', label: 'Chất liệu', type: 'text' },
            { name: 'series', label: 'Series', type: 'text' },
        ],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('attr_')) {
            const attributeName = name.replace('attr_', '');
            setProductData((prev) => ({
                ...prev,
                attributes: {
                    ...prev.attributes,
                    [attributeName]: value,
                },
            }));
        } else if (name === 'category') {
            // Reset attributes when category changes
            setProductData((prev) => ({
                ...prev,
                [name]: value,
                attributes: {
                    scale: '',
                    series: '',
                    grade: '',
                    material: '',
                },
            }));
        } else {
            setProductData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleEditorChange = (content) => {
        setProductData((prev) => ({
            ...prev,
            description: content,
        }));
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });
        formData.append('typeImages', 'product');
        const res = await requestUploadImage(formData);
        setProductData((prev) => ({
            ...prev,
            images: [...prev.images, ...res.metadata],
        }));
    };

    const handleRemoveImage = (indexToRemove) => {
        setProductData((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await requestCreateProduct(productData);
            toast.success(res.message);
            // Reset form after successful submission
            setProductData({
                name: '',
                category: '',
                brand: '',
                price: '',
                stock: '',
                description: '',
                images: [],
                attributes: {
                    scale: '',
                    series: '',
                    grade: '',
                    material: '',
                },
            });
            // Reset editor content
            if (editorRef.current) {
                editorRef.current.setContent('Mô tả sản phẩm');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const getPlaceholder = (category, attrName) => {
        const placeholders = {
            scale: {
                model_kit: '1/144, 1/100, 1/60...',
                metal_build: '1/100, 1/60...',
                figure: '1/7, 1/8...',
            },
            series: {
                model_kit: 'Gundam, Dragon Ball, One Piece...',
                metal_build: 'Gundam, Evangelion...',
                figure: 'Dragon Ball, One Piece, Naruto...',
                dung_cu: 'Tamiya, Mr.Hobby...',
                phu_kien: 'Action Base, Panel Line...',
            },
            grade: {
                model_kit: 'HG, RG, MG, PG...',
            },
            material: {
                dung_cu: 'Nhựa, Kim loại...',
                phu_kien: 'Nhựa, Kim loại...',
            },
        };

        return placeholders[attrName]?.[category] || '';
    };

    return (
        <Box className={cx('wrapper')} sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Toaster />
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#455a64' }}>
                                Thông tin cơ bản
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Tên sản phẩm"
                                name="name"
                                value={productData.name}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#1a237e',
                                        },
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Danh mục</InputLabel>
                                <Select
                                    name="category"
                                    value={productData.category}
                                    label="Danh mục"
                                    onChange={handleChange}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Thương hiệu</InputLabel>
                                <Select
                                    name="brand"
                                    value={productData.brand}
                                    label="Thương hiệu"
                                    onChange={handleChange}
                                >
                                    {brands.map((brand) => (
                                        <MenuItem key={brand.value} value={brand.value}>
                                            {brand.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Giá"
                                name="price"
                                type="number"
                                value={productData.price}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Số lượng tồn kho"
                                name="stock"
                                type="number"
                                value={productData.stock}
                                onChange={handleChange}
                            />
                        </Grid>

                        {productData.category && (
                            <>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ mt: 2, mb: 2, fontWeight: 500, color: '#455a64' }}
                                    >
                                        Thông tin chi tiết
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                </Grid>

                                {categoryAttributes[productData.category]?.map((attr) => (
                                    <Grid item xs={12} sm={6} key={attr.name}>
                                        <TextField
                                            required
                                            fullWidth
                                            label={attr.label}
                                            name={`attr_${attr.name}`}
                                            type={attr.type}
                                            value={productData.attributes[attr.name] || ''}
                                            onChange={handleChange}
                                            placeholder={getPlaceholder(productData.category, attr.name)}
                                        />
                                    </Grid>
                                ))}
                            </>
                        )}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 500, color: '#455a64' }}>
                                Mô tả sản phẩm
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Editor
                                apiKey="hfm046cu8943idr5fja0r5l2vzk9l8vkj5cp3hx2ka26l84x"
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={{
                                    plugins:
                                        'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                    toolbar:
                                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                }}
                                initialValue="Mô tả sản phẩm"
                                onEditorChange={handleEditorChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 500, color: '#455a64' }}>
                                Hình ảnh sản phẩm
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Box
                                sx={{
                                    border: '2px dashed #1a237e',
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    mb: 3,
                                    backgroundColor: '#f5f5f5',
                                }}
                            >
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    id="image-upload"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="image-upload">
                                    <Button
                                        component="span"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{
                                            color: '#1a237e',
                                            borderColor: '#1a237e',
                                            '&:hover': {
                                                borderColor: '#1a237e',
                                                backgroundColor: 'rgba(26, 35, 126, 0.04)',
                                            },
                                        }}
                                    >
                                        Tải lên hình ảnh
                                    </Button>
                                </label>
                                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                                    Hỗ trợ: JPG, PNG (Tối đa 5MB)
                                </Typography>
                            </Box>
                        </Grid>

                        {productData.images.length > 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {productData.images.map((image, index) => (
                                        <Card
                                            key={index}
                                            sx={{
                                                position: 'relative',
                                                width: 150,
                                                height: 150,
                                                borderRadius: 2,
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={image}
                                                alt={`Preview ${index + 1}`}
                                                sx={{
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                                    },
                                                }}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Card>
                                    ))}
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        minWidth: 120,
                                        borderColor: '#1a237e',
                                        color: '#1a237e',
                                        '&:hover': {
                                            borderColor: '#1a237e',
                                            backgroundColor: 'rgba(26, 35, 126, 0.04)',
                                        },
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        minWidth: 120,
                                        backgroundColor: '#1a237e',
                                        '&:hover': {
                                            backgroundColor: '#0d1b6e',
                                        },
                                    }}
                                >
                                    Thêm sản phẩm
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}

export default AddProduct;
