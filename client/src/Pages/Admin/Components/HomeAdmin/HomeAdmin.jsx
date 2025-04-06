import classNames from 'classnames/bind';
import styles from './HomeAdmin.module.scss';
import { Card, Row, Col, Statistic, Table, Badge } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { requestGetStatistic } from '../../../../config/request';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const cx = classNames.bind(styles);

// Thêm hàm xử lý status badge
const getStatusBadge = (status) => {
    const statusConfig = {
        pending: { color: 'warning', text: 'Chờ xử lý' },
        completed: { color: 'success', text: 'Hoàn thành' },
        shipping: { color: 'processing', text: 'Đang giao' },
        delivered: { color: 'success', text: 'Đã giao' },
        cancelled: { color: 'error', text: 'Đã hủy' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Badge status={config.color} text={config.text} />;
};

function HomeAdmin() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        newOrders: 0,
        todayRevenue: 0,
        weeklyRevenue: [],
        recentOrders: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await requestGetStatistic();
                setStats(res.metadata);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'order',
            key: 'order',
            render: (text) => <span style={{ fontWeight: '500', color: '#1890ff' }}>{text}</span>,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer',
            render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>,
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => <span style={{ color: '#52c41a', fontWeight: '500' }}>{amount.toLocaleString()}đ</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusBadge(status),
        },
    ];

    // Cập nhật chartData với dữ liệu thực
    const chartData = {
        labels: stats.weeklyRevenue.map((day) => day._id),
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: stats.weeklyRevenue.map((day) => day.dailyRevenue),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Thống kê doanh thu 7 ngày gần nhất',
                font: {
                    size: 16,
                    weight: '500',
                },
                padding: 20,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString() + ' đ';
                    },
                },
                grid: {
                    display: true,
                    drawBorder: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
        elements: {
            bar: {
                borderRadius: 4,
            },
        },
    };

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>Tổng quan</h1>

            <Row gutter={[16, 16]} className={cx('stats-row')}>
                <Col xs={24} sm={24} md={8}>
                    <Card hoverable className={cx('stat-card')}>
                        <Statistic
                            title={<span style={{ fontSize: '16px' }}>Tổng người dùng</span>}
                            value={stats.totalUsers}
                            prefix={<UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <Card hoverable className={cx('stat-card')}>
                        <Statistic
                            title={<span style={{ fontSize: '16px' }}>Đơn hàng mới</span>}
                            value={stats.newOrders}
                            prefix={<ShoppingCartOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <Card hoverable className={cx('stat-card')}>
                        <Statistic
                            title={<span style={{ fontSize: '16px' }}>Doanh thu hôm nay</span>}
                            value={stats.todayRevenue}
                            prefix={<DollarCircleOutlined style={{ fontSize: '24px', color: '#f5222d' }} />}
                            suffix="đ"
                            valueStyle={{ color: '#f5222d' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} lg={24}>
                    <Card className={cx('revenue-chart')} hoverable>
                        <Bar data={chartData} options={chartOptions} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card
                        title={<span style={{ fontSize: '16px', fontWeight: '500' }}>Đơn hàng gần đây</span>}
                        className={cx('recent-orders')}
                        hoverable
                    >
                        <Table
                            columns={columns}
                            dataSource={stats.recentOrders}
                            pagination={{ pageSize: 5 }}
                            className={cx('orders-table')}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default HomeAdmin;
