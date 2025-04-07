import classNames from 'classnames/bind';
import styles from './Contact.module.scss';
import Header from '../../Components/Header/Header';
import { Form, Input, Button, Card, message } from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    EnvironmentOutlined,
    ClockCircleOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { requestCreateContact } from '../../config/request';

const cx = classNames.bind(styles);

function Contact() {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const data = {
                name: values.name,
                email: values.email,
                message: values.message,
            };
            await requestCreateContact(data);
            message.success('Cảm ơn bạn đã gửi thông tin liên hệ!');
            form.resetFields();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>
            <div className={cx('content')}>
                <div className={cx('contact-header')}>
                    <h1>Liên Hệ Với Chúng Tôi</h1>
                    <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
                </div>
                
                <div className={cx('contact-container')}>
                    <div className={cx('contact-info-section')}>
                        <div className={cx('info-card', 'location')}>
                            <div className={cx('icon-wrapper')}>
                                <EnvironmentOutlined />
                            </div>
                            <h3>Địa Chỉ</h3>
                            <p>123 Đường ABC, Quận XYZ,<br />TP Hà Nội</p>
                        </div>

                        <div className={cx('info-card', 'contact')}>
                            <div className={cx('icon-wrapper')}>
                                <PhoneOutlined />
                            </div>
                            <h3>Điện Thoại & Email</h3>
                            <p>(84) 123-456-789</p>
                            <p>contact@example.com</p>
                        </div>
                    </div>

                    <Card className={cx('contact-form-card')}>
                        <h2>Gửi Tin Nhắn</h2>
                        <p className={cx('form-description')}>Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất có thể</p>
                        
                        <Form form={form} name="contact" onFinish={onFinish} layout="vertical">
                            <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}>
                                <Input 
                                    prefix={<UserOutlined className={cx('input-icon')} />} 
                                    placeholder="Họ và tên" 
                                    className={cx('custom-input')}
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input 
                                    prefix={<MailOutlined className={cx('input-icon')} />} 
                                    placeholder="Email" 
                                    className={cx('custom-input')}
                                />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung tin nhắn!' }]}
                            >
                                <Input.TextArea 
                                    placeholder="Nội dung tin nhắn" 
                                    rows={4} 
                                    className={cx('custom-textarea')}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className={cx('submit-button')}>
                                    Gửi tin nhắn
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Contact;
