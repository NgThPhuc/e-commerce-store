import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faUser, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useStore } from '../../hooks/useStore';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Header() {
    const { dataCart, dataUser } = useStore();
    const [checkHeader, setCheckHeader] = useState(0);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link style={{ textDecoration: 'none' }} to="/">
                    <div className={cx('logo')}>
                        <div className={cx('logo-text')}>
                            <span className={cx('store-name')}>NTPS_STORE</span>
                        </div>
                    </div>
                </Link>

                <div className={cx('nav-links')}>
                    <ul>
                        <Link
                            style={{ textDecoration: 'none', color: '#333' }}
                            to="/category"
                            onClick={() => setCheckHeader(0)}
                        >
                            <li className={cx(checkHeader === 0 ? 'checkHeader' : '')}>Sản Phẩm</li>
                        </Link>

                        <Link
                            style={{ textDecoration: 'none', color: '#333' }}
                            to="/blog"
                            onClick={() => setCheckHeader(1)}
                        >
                            <li className={cx(checkHeader === 1 ? 'checkHeader' : '')}>Bài Viết</li>
                        </Link>
                        
                        <Link
                            style={{ textDecoration: 'none', color: '#333' }}
                            to="/contact"
                            onClick={() => setCheckHeader(2)}
                        >
                            <li className={cx(checkHeader === 2 ? 'checkHeader' : '')}>Liên Hệ</li>
                        </Link>
                        
                        <Link
                            style={{ textDecoration: 'none', color: '#333' }}
                            to="/checkout"
                            onClick={() => setCheckHeader(3)}
                        >
                            <li className={cx(checkHeader === 3 ? 'checkHeader' : '')}>
                                <FontAwesomeIcon icon={faCreditCard} className={cx('nav-icon')} />
                                <span>Thanh Toán</span>
                            </li>
                        </Link>
                    </ul>
                </div>

                <div className={cx('user-actions')}>
                    {dataUser._id ? (
                        <div className={cx('controller-user')}>
                            <Link to="/cart">
                                <button id={cx('btn-cart')}>
                                    <FontAwesomeIcon icon={faCartPlus} />
                                    {dataCart?.data?.length > 0 && <span>{dataCart?.data?.length}</span>}
                                </button>
                            </Link>
                            <Link to="/info">
                                <button>
                                    <FontAwesomeIcon icon={faUser} />
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className={cx('auth-links')}>
                            <Link to="/login">
                                <li>Đăng Nhập</li>
                            </Link>
                            <Link to="/register">
                                <li>Đăng Ký</li>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
