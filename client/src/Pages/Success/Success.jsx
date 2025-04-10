import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Success.module.scss';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useStore } from '../../hooks/useStore';

const cx = classNames.bind(styles);

function Success() {
    const navigate = useNavigate();
    const { fetchCart } = useStore();

    useEffect(() => {
        // Refresh cart data after successful payment
        fetchCart();
    }, [fetchCart]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('success-container')}>
                <div className={cx('success-card')}>
                    <div className={cx('success-icon')}>
                        <FontAwesomeIcon icon={faCheckCircle} className={cx('check-icon')} />
                    </div>
                    <h1>Thanh Toán Thành Công!</h1>
                    <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.</p>
                    <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
                    
                    <div className={cx('button-group')}>
                        <Link to="/category" className={cx('continue-shopping')}>
                            Tiếp tục mua sắm
                        </Link>
                        <Link to="/profile" className={cx('view-orders')}>
                            Xem đơn hàng của tôi
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Success;
