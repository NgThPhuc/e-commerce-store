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

const cx = classNames.bind(styles);

function Checkout() {
    const { dataCart } = useStore();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState([]);
    const [selectAddress, setSelectAddress] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        if (fullName !== '' && phone !== '' && email !== '' && selectAddress !== '') {
            const data = {
                fullName,
                phone,
                email,
                address: selectAddress,
            };

            const handler = setTimeout(async () => {
                await requestUpdateInfoUserCart(data);
            }, 1000);

            return () => clearTimeout(handler); // Cleanup để tránh gọi API liên tục
        }
    }, [fullName, phone, email, selectAddress, 1000]);

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
        if (valueAddress === '') {
            return;
        }
        fetchData();
    }, [debounce]);

    const handlePaymenst = async (typePayment) => {
        if (typePayment === 'COD') {
            try {
                const res = await requestPayment({
                    typePayment,
                });
                navigate(`/payment/${res.metadata}`);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
        if (typePayment === 'MOMO') {
            try {
                const res = await requestPayment({
                    typePayment,
                });

                window.open(res.metadata.payUrl, '_blank');
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
        if (typePayment === 'VNPAY') {
            try {
                const res = await requestPayment({
                    typePayment,
                });

                window.open(res.metadata, '_blank');
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>

            <main className={cx('inner')}>
                <div className={cx('inner-checkout')}>
                    <div className={cx('column-billing')}>
                        <h1 id={cx('title-billing')}>Thông Tin Thanh Toán</h1>
                        <div className={cx('input-name')}>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên của bạn"
                                    onChange={(e) => setFullName(e.target.value)}
                                    value={fullName}
                                />
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Số điện thoại"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                            />
                        </div>

                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Autocomplete
                            disablePortal
                            options={address.map((option) => option.description)}
                            onChange={(e, value) => setSelectAddress(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Nhập địa chỉ"
                                    onChange={(e) => setValueAddress(e.target.value)}
                                />
                            )}
                        />
                    </div>

                    <div className={cx('form-order')}>
                        <div className={cx('inner-order')}>
                            <h1 id={cx('title-order')}>Sản Phẩm Thanh Toán</h1>

                            <div>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Tên Sản Phẩm</th>
                                            <th scope="col">Số Lượng</th>
                                            <th scope="col">Tổng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataCart?.data?.map((item) => (
                                            <tr key={item?._id}>
                                                <td>{item?.name}</td>
                                                <td>x {item?.quantity}</td>
                                                <td>$ {item.price?.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    <tbody>
                                        <tr>
                                            <td>Tạm Tính</td>
                                            <td></td>
                                            <td>$ {dataCart?.totalPrice?.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={cx('form-pay')}>
                                <div className={cx('checkbox-terms')}>
                                    <input onChange={(e) => setCheckBox(e.target.checked)} type="checkbox" />
                                    <label>Vui lòng chấp nhận điều khoản của chúng tôi</label>
                                </div>

                                <div className={cx('payment-vnpay')}>
                                    <button onClick={() => handlePaymenst('VNPAY')}>
                                        <img
                                            src={
                                                'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png'
                                            }
                                            alt=""
                                        />
                                        <span>Thanh Toán Qua VNPAY</span>
                                    </button>
                                </div>

                                <div className={cx('payment-momo')}>
                                    <button onClick={() => handlePaymenst('MOMO')}>
                                        <img
                                            src={
                                                'https://play-lh.googleusercontent.com/uCtnppeJ9ENYdJaSL5av-ZL1ZM1f3b35u9k8EOEjK3ZdyG509_2osbXGH5qzXVmoFv0=w240-h480-rw'
                                            }
                                            alt=""
                                        />
                                        <span>Thanh Toán Qua MOMO</span>
                                    </button>
                                </div>

                                <div className={cx('continue')}>
                                    <button onClick={() => handlePaymenst('COD')}>
                                        <span>Thanh Toán Khi Nhận Hàng</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Checkout;
