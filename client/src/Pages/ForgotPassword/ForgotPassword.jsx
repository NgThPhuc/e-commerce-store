import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';
import { useState } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { requestResetPassword, requestSendMailForgetPassword } from '../../config/request';

import toast, { Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    const handleSendCode = async () => {
        try {
            await requestSendMailForgetPassword({ email });
            setIsCodeSent(true);
        } catch (error) {
            setIsCodeSent(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            newPassword,
            otp: verificationCode,
        };
        try {
            const navigate = useNavigate();
            const res = await requestResetPassword(data);
            toast.success(res.message);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Toaster />
            <header>
                <Header />
            </header>

            <main className={cx('main-content')}>
                <div className={cx('forgot-password-container')}>
                    <h2>Quên mật khẩu</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={cx('form-group')}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>

                        <button type="button" onClick={handleSendCode} className={cx('send-code-btn')}>
                            Gửi mã xác nhận
                        </button>

                        {isCodeSent && (
                            <>
                                <div className={cx('form-group')}>
                                    <label>Mã xác nhận</label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        placeholder="Nhập mã xác nhận"
                                        required
                                    />
                                </div>

                                <div className={cx('form-group')}>
                                    <label>Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới"
                                        required
                                    />
                                </div>

                                <button type="submit" className={cx('submit-btn')}>
                                    Xác nhận
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default ForgotPassword;
