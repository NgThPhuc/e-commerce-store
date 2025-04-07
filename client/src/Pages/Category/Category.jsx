import classNames from 'classnames/bind';
import styles from './Category.module.scss';
import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Slider,
    Stack,
    Button,
    Divider,
    Chip,
    CircularProgress,
} from '@mui/material';
import { requestGetProducts, requestFilterProducts } from '../../config/request';
import CardBody from '../../Components/CardBody/CardBody';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

const cx = classNames.bind(styles);

function Category() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedScale, setSelectedScale] = useState('');
    const [selectedSeries, setSelectedSeries] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

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

    const sortOptions = [
        { value: 'default', label: 'Mặc định' },
        { value: 'price_asc', label: 'Giá: Thấp đến cao' },
        { value: 'price_desc', label: 'Giá: Cao đến thấp' },
        { value: 'newest', label: 'Mới nhất' },
    ];

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching initial products...');
            const response = await requestGetProducts();
            console.log('Initial products response:', response);
            if (response && response.metadata) {
                const productsData = Array.isArray(response.metadata) ? response.metadata : [];
                setProducts(productsData);
                setFilteredProducts(productsData);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Get unique values from products
    const scales = [...new Set(products.map((product) => product.attributes?.scale).filter(Boolean))].sort();
    const series = [...new Set(products.map((product) => product.attributes?.series).filter(Boolean))].sort();

    const fetchFilteredProducts = useCallback(async () => {
        if (isInitialLoad) return; // Skip filtering during initial load

        try {
            setLoading(true);
            setError(null);
            console.log('Fetching filtered products...');

            const params = {
                category: selectedCategory || undefined,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                searchQuery: searchQuery || undefined,
                brand: selectedBrand || undefined,
                scale: selectedScale || undefined,
                series: selectedSeries || undefined,
                grade: selectedGrade || undefined,
                sortBy: sortBy === 'default' ? undefined : sortBy,
            };

            // Remove undefined values
            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

            console.log('Filter params:', params);
            const response = await requestFilterProducts(params);
            console.log('Filter response:', response);

            if (response && response.metadata) {
                setFilteredProducts(response.metadata);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error filtering products:', error);
            setError('Không thể lọc sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, [
        isInitialLoad,
        selectedCategory,
        priceRange,
        searchQuery,
        selectedBrand,
        selectedScale,
        selectedSeries,
        selectedGrade,
        sortBy,
    ]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchFilteredProducts();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [fetchFilteredProducts]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        if (event.target.value !== 'model_kit') {
            setSelectedGrade('');
        }
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value);
    };

    const handleScaleChange = (event) => {
        setSelectedScale(event.target.value);
    };

    const handleSeriesChange = (event) => {
        setSelectedSeries(event.target.value);
    };

    const handleGradeChange = (event) => {
        setSelectedGrade(event.target.value);
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    const resetFilters = () => {
        setSelectedCategory('');
        setSelectedBrand('');
        setSelectedScale('');
        setSelectedSeries('');
        setSelectedGrade('');
        setPriceRange([0, 100000000]);
        setSearchQuery('');
        setSortBy('default');
    };

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>
            <main className={cx('main')}>
                <div className={cx('left')}>
                    <Stack spacing={3} sx={{ p: 2 }}>
                        <Typography variant="h6" color="primary">
                            Bộ lọc sản phẩm
                        </Typography>

                        <TextField
                            fullWidth
                            label="Tìm kiếm"
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            sx={{ mb: 2 }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Sắp xếp theo</InputLabel>
                            <Select value={sortBy} label="Sắp xếp theo" onChange={handleSortChange}>
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Divider />

                        <FormControl fullWidth>
                            <InputLabel>Danh mục</InputLabel>
                            <Select value={selectedCategory} label="Danh mục" onChange={handleCategoryChange}>
                                <MenuItem value="">Tất cả</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.value} value={category.value}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Thương hiệu</InputLabel>
                            <Select value={selectedBrand} label="Thương hiệu" onChange={handleBrandChange}>
                                <MenuItem value="">Tất cả</MenuItem>
                                {brands.map((brand) => (
                                    <MenuItem key={brand.value} value={brand.value}>
                                        {brand.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {selectedCategory === 'model_kit' && (
                            <FormControl fullWidth>
                                <InputLabel>Grade</InputLabel>
                                <Select value={selectedGrade} label="Grade" onChange={handleGradeChange}>
                                    <MenuItem value="">Tất cả</MenuItem>
                                    {grades.map((grade) => (
                                        <MenuItem key={grade.value} value={grade.value}>
                                            {grade.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {(selectedCategory === 'model_kit' || selectedCategory === 'metal_build' || selectedCategory === 'figure') && (
                            <FormControl fullWidth>
                                <InputLabel>Tỷ lệ</InputLabel>
                                <Select value={selectedScale} label="Tỷ lệ" onChange={handleScaleChange}>
                                    <MenuItem value="">Tất cả</MenuItem>
                                    {scales.map((scale) => (
                                        <MenuItem key={scale} value={scale}>
                                            {scale}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl fullWidth>
                            <InputLabel>Series</InputLabel>
                            <Select value={selectedSeries} label="Series" onChange={handleSeriesChange}>
                                <MenuItem value="">Tất cả</MenuItem>
                                {series.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        {s}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ px: 2 }}>
                            <Typography gutterBottom>Khoảng giá</Typography>
                            <Slider
                                value={priceRange}
                                onChange={handlePriceChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={100000000}
                                step={100000}
                                valueLabelFormat={formatPrice}
                            />
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">{formatPrice(priceRange[0])}</Typography>
                                <Typography variant="body2">{formatPrice(priceRange[1])}</Typography>
                            </Box>
                        </Box>

                        <Button variant="contained" onClick={resetFilters} fullWidth>
                            Xóa bộ lọc
                        </Button>
                    </Stack>
                </div>

                <div className={cx('right')}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            {selectedCategory
                                ? categories.find((c) => c.value === selectedCategory)?.label
                                : 'Tất cả sản phẩm'}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                            {selectedCategory && (
                                <Chip
                                    label={categories.find((c) => c.value === selectedCategory)?.label}
                                    onDelete={() => setSelectedCategory('')}
                                />
                            )}
                            {selectedBrand && (
                                <Chip
                                    label={brands.find((b) => b.value === selectedBrand)?.label}
                                    onDelete={() => setSelectedBrand('')}
                                />
                            )}
                            {selectedGrade && (
                                <Chip
                                    label={grades.find((g) => g.value === selectedGrade)?.label}
                                    onDelete={() => setSelectedGrade('')}
                                />
                            )}
                            {selectedScale && (
                                <Chip label={`Tỷ lệ: ${selectedScale}`} onDelete={() => setSelectedScale('')} />
                            )}
                            {selectedSeries && (
                                <Chip label={`Series: ${selectedSeries}`} onDelete={() => setSelectedSeries('')} />
                            )}
                            {searchQuery && (
                                <Chip label={`Tìm kiếm: ${searchQuery}`} onDelete={() => setSearchQuery('')} />
                            )}
                        </Stack>
                    </Box>

                    <Grid container spacing={2}>
                        {loading ? (
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                                <Typography color="error">{error}</Typography>
                                <Button variant="contained" onClick={fetchFilteredProducts} sx={{ mt: 2 }}>
                                    Thử lại
                                </Button>
                            </Box>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                    <CardBody data={product} />
                                </Grid>
                            ))
                        ) : (
                            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                                <Typography>Không tìm thấy sản phẩm nào</Typography>
                            </Box>
                        )}
                    </Grid>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Category;
