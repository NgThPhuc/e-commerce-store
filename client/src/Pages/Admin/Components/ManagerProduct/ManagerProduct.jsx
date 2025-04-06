import classNames from 'classnames/bind';
import styles from './ManagerProduct.module.scss';
import { useState, useEffect } from 'react';
import { message } from 'antd';
import AddProduct from './AddProduct/AddProduct';
import { requestDeleteProduct, requestGetAllProducts } from '../../../../config/request';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const cx = classNames.bind(styles);

function ManagerProduct() {
    const [type, setType] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [idProduct, setIdProduct] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await requestGetAllProducts({
                limit: 5,
                page: currentPage,
            });

            if (res?.metadata) {
                setProducts(res.metadata.products);
                setTotalPage(res.metadata.pagination.totalPages);
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (type === 0) {
            fetchProducts();
        }
    }, [type, currentPage]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleDeleteProduct = async (id) => {
        try {
            const res = await requestDeleteProduct(id);
            message.success(res.message);
            fetchProducts();
        } catch (error) {
            message.error('Lỗi khi xóa sản phẩm');
        }
    };

    const renderTableRows = () => {
        return products.map((product, index) => (
            <TableRow key={product._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell align="center">
                    <img style={{ width: '100px' }} src={product.images[0]} alt={product.name} />
                </TableCell>
                <TableCell align="center">{product.name}</TableCell>
                <TableCell align="center">{product.price.toLocaleString()} VNĐ</TableCell>
                <TableCell align="center">{product.stock}</TableCell>
                <TableCell align="center">
                    <button
                        onClick={() => handleDeleteProduct(product._id)}
                        style={{ marginLeft: '10px' }}
                        type="button"
                        className="btn btn-danger"
                    >
                        Xóa
                    </button>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <h4>{type === 0 ? 'Danh sách sản phẩm' : type === 1 ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}</h4>
                <button onClick={() => setType(type === 0 ? 1 : 0)} type="button" className="btn btn-primary">
                    {type === 0 ? 'Thêm sản phẩm' : 'Quay lại'}
                </button>
            </header>

            {type === 0 ? (
                <div className={cx('product-list')}>
                    <TableContainer component={Paper}>
                        {loading ? (
                            <div className={cx('loading-state')}>Đang tải dữ liệu...</div>
                        ) : (
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell align="center">Ảnh</TableCell>
                                        <TableCell align="center">Tên sản phẩm</TableCell>
                                        <TableCell align="center">Giá</TableCell>
                                        <TableCell align="center">Số lượng còn lại</TableCell>
                                        <TableCell align="center">Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>{renderTableRows()}</TableBody>
                            </Table>
                        )}
                    </TableContainer>

                    <div className={cx('pagination-wrapper')}>
                        <Pagination
                            page={currentPage}
                            count={totalPage}
                            color="primary"
                            onChange={handlePageChange}
                            disabled={loading}
                        />
                    </div>
                </div>
            ) : type === 1 ? (
                <AddProduct
                    onSuccess={() => {
                        setType(0);
                        setCurrentPage(1);
                        fetchProducts();
                    }}
                />
            ) : null}
        </div>
    );
}

export default ManagerProduct;
