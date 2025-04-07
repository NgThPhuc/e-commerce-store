import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { useStore } from '../../hooks/useStore';
import useDebounce from '../../hooks/useDebounce';
import axios from 'axios';
import { requestPayment, requestUpdateInfoUserCart } from '../../config/request';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faShieldHalved, faTruck } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Checkout() {
    const { dataCart } = useStore();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState([]);
    const [selectAddress, setSelectAddress] = useState('');
    const [checkbox, setCheckBox] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (fullName !== '' && phone !== '' && email !== '' && selectAddress !== '') {
            const data = { fullName, phone, email, address: selectAddress };
            const handler = setTimeout(async () => {
                await requestUpdateInfoUserCart(data);
            }, 1000);
            return () => clearTimeout(handler);
        }
    }, [fullName, phone, email, selectAddress]);

    const [valueAddress, setValueAddress] = useState('');
    const debounce = useDebounce(valueAddress, 800);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('https://rsapi.goong.io/Place/AutoComplete', {
                params: {
                    input: debounce,
                    api_key: '3HcKy9jen6utmzxno4HwpkN1fJYll5EM90k53N4K',
                },
            });
            setAddress(response.data.predictions);
        };
        if (valueAddress === '') return;
        fetchData();
    }, [debounce]);

    const handlePayment = async (typePayment) => {
        if (!checkbox) {
            toast.error('Vui lòng chấp nhận điều khoản của chúng tôi');
            return;
        }
        
        try {
            const res = await requestPayment({ typePayment });
            
            if (typePayment === 'COD') {
                navigate(`/payment/${res.metadata}`);
            } else if (typePayment === 'MOMO' || typePayment === 'VNPAY') {
                window.open(res.metadata.payUrl || res.metadata, '_blank');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Header />
            
            <div className={cx('checkout-header')}>
                <h1>Thanh Toán</h1>
                <div className={cx('security-badges')}>
                    <div className={cx('badge')}>
                        <FontAwesomeIcon icon={faLock} />
                        <span>Thanh toán an toàn</span>
                    </div>
                    <div className={cx('badge')}>
                        <FontAwesomeIcon icon={faShieldHalved} />
                        <span>Bảo mật thông tin</span>
                    </div>
                    <div className={cx('badge')}>
                        <FontAwesomeIcon icon={faTruck} />
                        <span>Giao hàng nhanh chóng</span>
                    </div>
                </div>
            </div>

            <main className={cx('inner')}>
                <div className={cx('inner-checkout')}>
                    <div className={cx('column-billing')}>
                        <div className={cx('section-title')}>
                            <h2>Thông Tin Thanh Toán</h2>
                            <p>Vui lòng điền đầy đủ thông tin bên dưới</p>
                        </div>
                        
                        <div className={cx('form-group')}>
                            <input
                                type="text"
                                className={cx('form-control')}
                                placeholder="Họ và tên"
                                onChange={(e) => setFullName(e.target.value)}
                                value={fullName}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                type="tel"
                                className={cx('form-control')}
                                placeholder="Số điện thoại"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                type="email"
                                className={cx('form-control')}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <Autocomplete
                                disablePortal
                                options={address.map((option) => option.description)}
                                onChange={(e, value) => setSelectAddress(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Địa chỉ giao hàng"
                                        onChange={(e) => setValueAddress(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className={cx('order-summary')}>
                        <div className={cx('section-title')}>
                            <h2>Đơn Hàng Của Bạn</h2>
                            <p>Xem lại đơn hàng trước khi thanh toán</p>
                        </div>

                        <div className={cx('order-items')}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sản Phẩm</th>
                                        <th>SL</th>
                                        <th>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCart?.data?.map((item) => (
                                        <tr key={item?._id}>
                                            <td>{item?.name}</td>
                                            <td>{item?.quantity}</td>
                                            <td>${item.price?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr className={cx('total-row')}>
                                        <td colSpan="2">Tổng cộng</td>
                                        <td>${dataCart?.totalPrice?.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className={cx('payment-methods')}>
                            <h3>Phương Thức Thanh Toán</h3>
                            
                            <div className={cx('payment-options')}>
                                <button 
                                    className={cx('payment-button', 'cod')} 
                                    onClick={() => handlePayment('COD')}
                                >
                                    Thanh toán khi nhận hàng (COD)
                                </button>
                                
                                <button 
                                    className={cx('payment-button', 'vnpay')} 
                                    onClick={() => handlePayment('VNPAY')}
                                >
                                    <img
                                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                                        alt="VNPAY"
                                    />
                                    Thanh toán VNPAY
                                </button>
                                
                                <button 
                                    className={cx('payment-button', 'momo')} 
                                    onClick={() => handlePayment('MOMO')}
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                        alt="MOMO"
                                    />
                                    Thanh toán MOMO
                                </button>
                            </div>

                            <div className={cx('terms-checkbox')}>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={checkbox}
                                        onChange={(e) => setCheckBox(e.target.checked)}
                                    />
                                    <span>Tôi đồng ý với các điều khoản và điều kiện</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <Toaster position="top-center" />
        </div>
    );
}

export default Checkout;
