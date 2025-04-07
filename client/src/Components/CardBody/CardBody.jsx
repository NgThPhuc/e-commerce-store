import classNames from 'classnames/bind';
import styles from './CardBody.module.scss';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

const cx = classNames.bind(styles);

function CardBody({ data }) {
    if (!data) return null;

    return (
        <Card className={cx('wrapper')} elevation={1}>
            <Link to={`/product/${data._id}`} style={{ textDecoration: 'none' }}>
                <CardMedia
                    component="img"
                    image={data.images[0]}
                    alt={data.name}
                    sx={{ height: 200, objectFit: 'contain' }}
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                        {data.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(data.price)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        {data.brand && (
                            <Typography variant="body2" color="text.secondary">
                                Thương hiệu: {data.brand}
                            </Typography>
                        )}
                        {data.attributes?.scale && (
                            <Typography variant="body2" color="text.secondary">
                                Tỷ lệ: {data.attributes.scale}
                            </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                            Còn lại: {data.stock} sản phẩm
                        </Typography>
                    </Box>
                </CardContent>
            </Link>
        </Card>
    );
}

export default CardBody;
