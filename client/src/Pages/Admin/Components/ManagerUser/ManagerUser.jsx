import classNames from 'classnames/bind';
import styles from './ManagerUser.module.scss';
import { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import { requestGetAllUser } from '../../../../config/request';

import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function ManagerUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetAllUser();
            setUsers(res.metadata.users);
        };
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => dayjs(createdAt).format('DD/MM/YYYY'),
        },
        {
            title: 'Loại tài khoản',
            dataIndex: 'typeLogin',
            key: 'typeLogin',
            render: (type) => <Tag color={type === 'email' ? 'blue' : 'green'}>{type.toUpperCase()}</Tag>,
        },
        {
            title: 'Trạng thái',
            key: 'isActive',
            dataIndex: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'error' : 'success'}>{isActive ? 'Không hoạt động' : ' Hoạt động'}</Tag>
            ),
        },
    ];

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Quản lý người dùng</h2>
            <Table columns={columns} dataSource={users} />
        </div>
    );
}

export default ManagerUser;
