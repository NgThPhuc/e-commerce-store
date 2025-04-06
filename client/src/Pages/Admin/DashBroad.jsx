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
import { requestAdmin } from '../../config/request';

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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await requestAdmin();
                console.log(res);
            } catch (error) {
                navigate('/');
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('slide__bar')}>
                    <Link to={'/'}>
                        <div className={cx('header')}>
                            <img src={'https://5sfashion.vn/frontend/assets/images/logo.png'} alt="" />
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
