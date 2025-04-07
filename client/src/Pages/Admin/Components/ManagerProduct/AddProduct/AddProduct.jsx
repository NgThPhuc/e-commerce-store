import classNames from 'classnames/bind';
import styles from './AddProduct.module.scss';
import { useState } from 'react';
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

    const [loading, setLoading] = useState(false);

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

    const grades = [
        { value: 'hg', label: 'High Grade (HG)' },
        { value: 'rg', label: 'Real Grade (RG)' },
        { value: 'mg', label: 'Master Grade (MG)' },
        { value: 'pg', label: 'Perfect Grade (PG)' },
    ];

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setProductData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setProductData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('image', files[0]);

                const response = await requestUploadImage(formData);
                if (response.metadata) {
                    setProductData((prev) => ({
                        ...prev,
                        images: [...prev.images, response.metadata],
                    }));
                    toast.success('Tải ảnh lên thành công');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Lỗi khi tải ảnh lên');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRemoveImage = (index) => {
        setProductData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await requestCreateProduct(productData);
            if (response.metadata) {
                toast.success('Thêm sản phẩm thành công');
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
            }
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Lỗi khi thêm sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Thêm sản phẩm mới
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <TextField
                                required
                                fullWidth
                                label="Tên sản phẩm"
                                value={productData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />

                            <FormControl fullWidth required>
                                <InputLabel>Danh mục</InputLabel>
                                <Select
                                    value={productData.category}
                                    label="Danh mục"
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth required>
                                <InputLabel>Thương hiệu</InputLabel>
                                <Select
                                    value={productData.brand}
                                    label="Thương hiệu"
                                    onChange={(e) => handleInputChange('brand', e.target.value)}
                                >
                                    {brands.map((brand) => (
                                        <MenuItem key={brand.value} value={brand.value}>
                                            {brand.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        label="Giá"
                                        value={productData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        InputProps={{
                                            inputProps: { min: 0 },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        label="Số lượng trong kho"
                                        value={productData.stock}
                                        onChange={(e) => handleInputChange('stock', e.target.value)}
                                        InputProps={{
                                            inputProps: { min: 0 },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {productData.category === 'model_kit' && (
                                <FormControl fullWidth>
                                    <InputLabel>Grade</InputLabel>
                                    <Select
                                        value={productData.attributes.grade}
                                        label="Grade"
                                        onChange={(e) => handleInputChange('attributes.grade', e.target.value)}
                                    >
                                        {grades.map((grade) => (
                                            <MenuItem key={grade.value} value={grade.value}>
                                                {grade.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {(productData.category === 'model_kit' ||
                                productData.category === 'metal_build' ||
                                productData.category === 'figure') && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Tỷ lệ"
                                        value={productData.attributes.scale}
                                        onChange={(e) => handleInputChange('attributes.scale', e.target.value)}
                                        placeholder="Ví dụ: 1/144, 1/100"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Series"
                                        value={productData.attributes.series}
                                        onChange={(e) => handleInputChange('attributes.series', e.target.value)}
                                        placeholder="Ví dụ: Gundam, Dragon Ball"
                                    />
                                </>
                            )}

                            {(productData.category === 'dung_cu' || productData.category === 'phu_kien') && (
                                <TextField
                                    fullWidth
                                    label="Chất liệu"
                                    value={productData.attributes.material}
                                    onChange={(e) => handleInputChange('attributes.material', e.target.value)}
                                />
                            )}

                            <Typography variant="subtitle1" gutterBottom>
                                Mô tả sản phẩm
                            </Typography>
                            <Editor
                                apiKey="tm5dadnc4s9g3p373vo61phwfnl3w5nli8ouwj0v2rnn6efj"
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                                value={productData.description}
                                onEditorChange={(content) => handleInputChange('description', content)}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <Typography variant="subtitle1" gutterBottom>
                                Hình ảnh sản phẩm
                            </Typography>

                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mb: 2 }}
                                disabled={loading}
                            >
                                Tải ảnh lên
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </Button>

                            <Stack spacing={2}>
                                {productData.images.map((image, index) => (
                                    <Card key={index}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={image}
                                            alt={`Product image ${index + 1}`}
                                            sx={{ objectFit: 'contain' }}
                                        />
                                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveImage(index)}
                                                disabled={loading}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Card>
                                ))}
                            </Stack>
                        </Stack>
                    </Paper>

                    <Box sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Toaster position="top-right" />
        </Box>
    );
}

export default AddProduct;
