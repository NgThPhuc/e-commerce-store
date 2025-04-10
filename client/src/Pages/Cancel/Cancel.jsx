import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Cancel.module.scss';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Cancel() {
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        // Get error code from URL if available
        const params = new URLSearchParams(location.search);
        const errorCode = params.get('code');
        const errorType = params.get('error');
        
        if (errorCode) {
            switch(errorCode) {
                case '01':
                    setErrorMessage('Giao dịch đã được xác nhận');
                    break;
                case '02':
                    setErrorMessage('Giao dịch chưa được xác nhận');
                    break;
                case '04':
                    setErrorMessage('Giao dịch đã bị hủy');
                    break;
                case '05':
                    setErrorMessage('Giao dịch không thành công do: Quý khách nhập sai mật khẩu xác thực');
                    break;
                case '13':
                    setErrorMessage('Giao dịch không thành công do: Quý khách nhập sai mật khẩu xác thực quá số lần quy định');
                    break;
                case '24':
                    setErrorMessage('Giao dịch không thành công do: Khách hàng hủy giao dịch');
                    break;
                case '51':
                    setErrorMessage('Giao dịch không thành công do: Tài khoản không đủ số dư để thực hiện giao dịch');
                    break;
                case '65':
                    setErrorMessage('Giao dịch không thành công do: Tài khoản quý khách đã vượt quá hạn mức giao dịch trong ngày');
                    break;
                case '75':
                    setErrorMessage('Ngân hàng thanh toán đang bảo trì');
                    break;
                case '79':
                    setErrorMessage('Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định');
                    break;
                default:
                    setErrorMessage('Giao dịch không thành công');
            }
        } else if (errorType) {
            switch(errorType) {
                case 'missing_user_id':
                    setErrorMessage('Không tìm thấy thông tin người dùng');
                    break;
                case 'cart_not_found':
                    setErrorMessage('Không tìm thấy giỏ hàng');
                    break;
                case 'server_error':
                    setErrorMessage('Lỗi máy chủ, vui lòng thử lại sau');
                    break;
                default:
                    setErrorMessage('Giao dịch không thành công');
            }
        } else {
            setErrorMessage('Giao dịch đã bị hủy');
        }
    }, [location]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('cancel-container')}>
                <div className={cx('cancel-card')}>
                    <div className={cx('cancel-icon')}>
                        <FontAwesomeIcon icon={faTimesCircle} className={cx('times-icon')} />
                    </div>
                    <h1>Thanh Toán Không Thành Công</h1>
                    <p className={cx('error-message')}>{errorMessage}</p>
                    <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
                    
                    <div className={cx('button-group')}>
                        <Link to="/checkout" className={cx('try-again')}>
                            Thử lại
                        </Link>
                        <Link to="/category" className={cx('continue-shopping')}>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Cancel;
