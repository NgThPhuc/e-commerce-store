import classNames from 'classnames/bind';
import styles from './ProductSell.module.scss';
import { useEffect, useState } from 'react';
import { requestGetAllProducts } from '../../../config/request';
import CardBody from '../../CardBody/CardBody';
import { Box, Grid, Typography, Container } from '@mui/material';
import modelKit from '../../../assets/images/New folder/model_kit.jfif';
import metalBuild from '../../../assets/images/New folder/metal_build.jfif';
import figure from '../../../assets/images/New folder/figure.jpg';
import tools from '../../../assets/images/New folder/tools.jfif';
import accessories from '../../../assets/images/New folder/accessories.webp';

import logoBandai from '../../../assets/images/logo_brand/bandai.png';
import logoMoshow from '../../../assets/images/logo_brand/moshow.jpg';


const cx = classNames.bind(styles);

const categories = [
    { 
        name: 'Model Kit',
        description: 'Bộ sưu tập Gundam và mô hình lắp ráp',
        image: modelKit
    },
    { 
        name: 'Metal Build',
        description: 'Mô hình kim loại cao cấp',
        image: metalBuild
    },
    { 
        name: 'Figure',
        description: 'Mô hình nhân vật anime/manga',
        image: figure
    },
    { 
        name: 'Dụng cụ',
        description: 'Dụng cụ lắp ráp và sơn mô hình',
        image: tools
    },
    { 
        name: 'Phụ kiện',
        description: 'Phụ kiện trang trí và trưng bày',
        image: accessories
    }
];

const brands = [
    { name: 'Bandai', logo: logoBandai },
    { name: 'Moshow', logo: logoMoshow },
    { name: 'Dragon', logo: metalBuild },
    { name: 'Tamiya', logo: metalBuild }
];

function ProductSell() {
    const [dataProducts, setDataProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await requestGetAllProducts();
                setDataProducts(res.metadata.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Container maxWidth="lg" className={cx('wrapper')}>
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                    Danh mục sản phẩm
                </Typography>
                
                <Grid container spacing={3}>
                    {categories.map((category, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                className={cx('category-card')}
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                    },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={category.image}
                                    alt={category.name}
                                    sx={{
                                        width: '100%',
                                        height: 200,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        mb: 2
                                    }}
                                />
                                <Typography variant="h6" gutterBottom>
                                    {category.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {category.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="h4" gutterBottom align="center" sx={{ mt: 8, mb: 4 }}>
                    Thương hiệu nổi bật
                </Typography>
                
                <Grid container spacing={4} justifyContent="center">
                    {brands.map((brand, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <Box
                                className={cx('brand-card')}
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 100,
                                    borderRadius: 2,
                                    backgroundColor: '#f5f5f5',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={brand.logo}
                                    alt={brand.name}
                                    sx={{
                                        maxWidth: '80%',
                                        maxHeight: '80%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {dataProducts.length > 0 && (
                    <Box sx={{ mt: 8 }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                            Sản phẩm nổi bật
                        </Typography>
                        <Grid container spacing={3}>
                            {dataProducts.slice(0, 8).map((product) => (
                                <Grid item xs={12} sm={6} md={3} key={product._id}>
                                    <CardBody data={product} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default ProductSell;
