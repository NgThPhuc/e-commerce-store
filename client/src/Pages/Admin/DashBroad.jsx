import classNames from 'classnames/bind';
import styles from './DashBroad.module.scss';

import logo from '../../assets/images/logo.png';

import ManagerProduct from './Components/ManagerProduct/ManagerProduct';
import ManagerUser from './Components/ManagerUser/ManagerUser';
import ManagerBlog from './Components/ManagerBlog/ManagerBlog';
import ManagerOrder from './Components/ManagerOrder/ManagerOrder';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeAdmin from './Components/HomeAdmin/HomeAdmin';
import ManagerContact from './Components/ManagerContact/ManagerContact';
import { requestAdmin, requestRefreshToken } from '../../config/request';
import toast, { Toaster } from 'react-hot-toast';

const cx = classNames.bind(styles);

const components = [
    { id: 0, name: 'Trang chủ', component: <HomeAdmin /> },
    { id: 4, name: 'Quản lý đơn hàng', component: <ManagerOrder /> },
    { id: 1, name: 'Quản lý sản phẩm', component: <ManagerProduct /> },
    { id: 2, name: 'Quản lý người dùng', component: <ManagerUser /> },
    { id: 3, name: 'Quản lý bài viết', component: <ManagerBlog /> },
    { id: 5, name: 'Quản lý liên hệ', component: <ManagerContact /> },
];

function DashBroad() {
    const [type, setType] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // First try to refresh the token to ensure we have a valid session
                await requestRefreshToken();
                
                // Then try to access the admin page
                const res = await requestAdmin();
                console.log(res);
                setLoading(false);
            } catch (error) {
                console.error('Error accessing admin page:', error);
                setError('Bạn không có quyền truy cập trang admin');
                toast.error('Bạn không có quyền truy cập trang admin');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className={cx('wrapper', 'loading-container')}>
                <div className={cx('loading-message')}>
                    <h2>Đang tải dữ liệu...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cx('wrapper', 'error-container')}>
                <div className={cx('error-message')}>
                    <h2>{error}</h2>
                    <p>Đang chuyển hướng về trang chủ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <Toaster />
            <div className={cx('inner')}>
                <div className={cx('slide__bar')}>
                    <Link to={'/'}>
                        <div className={cx('header')}>
                            <span className={cx('store-name')}>NTPS_STORE</span>
                        </div>
                    </Link>

                    {components.map((item, index) => (
                        <div
                            id={cx(type === item.id && 'active')}
                            onClick={() => setType(item.id)}
                            key={index}
                            className={cx('slide__item')}
                        >
                            <h4>{item.name}</h4>
                        </div>
                    ))}
                </div>
                <div className={cx('home__page')}>
                    {components.map((item, index) => (
                        <div key={index}>{item.id === type && item.component}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashBroad;
