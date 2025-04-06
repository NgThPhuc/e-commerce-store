import classNames from 'classnames/bind';
import styles from './LoginUser.module.scss';
import Header from '../../Components/Header/Header';

import toast, { Toaster } from 'react-hot-toast';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { requestLogin, requestLoginGoogle } from '../../config/request';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const cx = classNames.bind(styles);
function LoginUser() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        const data = {
            email: email,
            password: password,
        };
        try {
            const res = await requestLogin(data);
            toast.success(res.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleSuccess = async (response) => {
        const { credential } = response; // Nhận ID Token từ Google
        try {
            const res = await requestLoginGoogle(credential);
            toast.success(res.message);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Toaster />
            <header>
                <Header />
            </header>
            <div className={cx('container')}>
                <div className={cx('inner')}>
                    <div className={cx('header-form-login')}>
                        <span>Đăng Nhập</span>
                        <p>Nhập thông tin đăng nhập để có quyền truy cập</p>
                    </div>
                    <div className={cx('input-box')}>
                        <div className={cx('form-input')}>
                            <label>Email</label>
                            <input placeholder=" Email " onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={cx('form-input')}>
                            <label>Mật khẩu</label>
                            <input
                                placeholder="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                                <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
                            </GoogleOAuthProvider>
                        </div>
                        <div className={cx('single-input-fields')}>
                            <div style={{ float: 'right' }}>
                                <Link to="/forgot-password">Quên mật khẩu ?</Link>
                            </div>
                        </div>
                    </div>

                    <div className={cx('login-footer')}>
                        <p>
                            Bạn chưa có tài khoản?{' '}
                            <Link id={cx('link')} to="/register">
                                Đăng ký
                            </Link>{' '}
                        </p>
                        <button onClick={handleLogin}>Đăng nhập</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginUser;
