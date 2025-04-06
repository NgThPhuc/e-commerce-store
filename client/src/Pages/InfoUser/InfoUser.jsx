import classNames from 'classnames/bind';
import styles from './InfoUser.module.scss';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { useStore } from '../../hooks/useStore';

import { requestGetPayment, requestLogout } from '../../config/request';

import Button from '@mui/material/Button';
import ModalChangePassword from './modal/ModalChangePassword';

const cx = classNames.bind(styles);

function InfoUser() {
    const [dataOrder, setDataOrder] = useState([]);

    const [openModal, setOpenModal] = useState(false);

    const onOpenModal = () => {
        setOpenModal(true);
    };

    const statusMapping = {
        pending: 'Đang xác nhận',
        completed: 'Đã xác nhận',
        shipping: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Hủy',
    };

    const { dataUser } = useStore();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await requestLogout();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetPayment();
            setDataOrder(res.metadata.orders);
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>

            <main className={cx('inner')}>
                <div className={cx('form-info-user')}>
                    <div className={cx('column-1')}>
                        <img src={'https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png'} alt="..." />
                        <h3>{dataUser?.fullName}</h3>
                        <button onClick={handleLogout}>Đăng Xuất</button>
                    </div>
                    <div className={cx('column-2')}>
                        <h2>Thông Tin Cá Nhân</h2>

                        <div className={cx('info-contact')}>
                            <div>
                                <h3>Email</h3>
                                <span>{dataUser?.email}</span>
                            </div>

                            <div>
                                <h3>Số Điện Thoại</h3>
                                <span>{dataUser?.phone}</span>
                            </div>
                        </div>
                        <div>
                            <Button onClick={onOpenModal} sx={{ mt: 2 }} variant="contained">
                                Đổi mật khẩu
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <div className={cx('table-order-1')}>
                <TableContainer component={Paper} className={cx('table-order')}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Đơn Hàng</TableCell>
                                <TableCell>Người Nhận</TableCell>
                                <TableCell>Số Điện Thoại</TableCell>
                                <TableCell>Địa Chỉ</TableCell>
                                <TableCell>Trạng Thái Thanh Toán</TableCell>
                                <TableCell>Trạng Thái Đơn Hàng</TableCell>
                                <TableCell>Sản Phẩm</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataOrder.map((order, index) => (
                                <TableRow key={order.orderId}>
                                    <TableCell>{index}</TableCell>
                                    <TableCell>{order.fullName}</TableCell>
                                    <TableCell>0{order.phone}</TableCell>
                                    <TableCell>{order.address}</TableCell>
                                    <TableCell>{order.typePayments}</TableCell>
                                    <TableCell>{statusMapping[order.statusOrder] || 'Không xác định'}</TableCell>
                                    <TableCell>
                                        <ul>
                                            {order.products.map((product) => (
                                                <li key={product.productId}>
                                                    {product.name} - SL: {product.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <footer>
                <Footer />
            </footer>
            <ModalChangePassword open={openModal} setOpen={setOpenModal} />
        </div>
    );
}

export default InfoUser;
