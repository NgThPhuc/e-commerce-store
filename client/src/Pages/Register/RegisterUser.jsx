import classNames from 'classnames/bind';
import styles from './RegisterUser.module.scss';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../../Components/Header/Header';

import toast, { Toaster } from 'react-hot-toast';
import { requestRegister } from '../../config/request';

const cx = classNames.bind(styles);

function RegisterUser() {
    const [fullname, setFullname] = useState(''); // Tạo state để lưu fullname
    const [email, setEmail] = useState(''); // Tạo state để lưu email
    const [phone, setPhone] = useState(''); // Tạo state để lưu phone
    const [password, setPassword] = useState(''); // Tạo state để lưu password
    const [confirmPassword, setConfirmPassword] = useState(''); // Tạo state để lưu confirmPassword

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const data = {
                fullName: fullname,
                email: email,
                phone: phone,
                password: password,
                confirmPassword: confirmPassword,
            };
            if (password !== confirmPassword) {
                return toast.error('Mật khẩu không khớp');
            }
            const res = await requestRegister(data);
            toast.success(res.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            <Toaster />
            <header>
                <Header />
            </header>
            <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <div className={cx('header-form-login')}>
                        <span>Đăng ký</span>
                        <p>Tạo tài khoản của bạn để có quyền truy cập đầy đủ</p>
                    </div>
                    <div className={cx('input-box')}>
                        <div className={cx('form-input')}>
                            <label>Họ và tên</label>
                            <input placeholder="Họ và tên" onChange={(e) => setFullname(e.target.value)} />
                        </div>

                        <div className={cx('form-input')}>
                            <label>Email </label>
                            <input placeholder=" Email " onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className={cx('form-input')}>
                            <label>Số điện thoại</label>
                            <input placeholder="Số điện thoại" onChange={(e) => setPhone(e.target.value)} />
                        </div>

                        <div className={cx('form-input')}>
                            <label>Mật khẩu</label>

                            <input
                                placeholder="Mật khẩu"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className={cx('form-input')}>
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu
"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('login-footer')}>
                        <p>
                            Bạn đã có tài khoản ?
                            <Link id={cx('link')} to="/login">
                                Đăng nhập
                            </Link>
                        </p>
                        <button onClick={handleRegister}>Đăng ký</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterUser;
