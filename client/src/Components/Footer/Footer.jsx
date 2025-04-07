import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMapMarkerAlt, 
    faPhone, 
    faEnvelope,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { 
    faFacebookF, 
    faInstagram, 
    faTwitter 
} from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('footer-content')}>
                    <div className={cx('footer-section', 'about')}>
                        <h3 className={cx('store-name')}>NTPS_STORE</h3>
                        <p>Chuyên cung cấp các mẫu thời trang cao cấp</p>
                        <div className={cx('contact-info')}>
                            <div><FontAwesomeIcon icon={faMapMarkerAlt} /> Địa chỉ: 123 Đường ABC, Quận XYZ, TP Hà Nội</div>
                            <div><FontAwesomeIcon icon={faPhone} /> Điện thoại: (84) 123-456-789</div>
                            <div><FontAwesomeIcon icon={faEnvelope} /> Email: contact@example.com</div>
                        </div>
                        <div className={cx('socials')}>
                            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                        </div>
                    </div>

                    <div className={cx('footer-section', 'links')}>
                        <h4>Liên Kết Nhanh</h4>
                        <ul>
                            <li><FontAwesomeIcon icon={faChevronRight} /> Trang Chủ</li>
                            <li><FontAwesomeIcon icon={faChevronRight} /> Sản Phẩm</li>
                            <li><FontAwesomeIcon icon={faChevronRight} /> Bài Viết</li>
                            <li><FontAwesomeIcon icon={faChevronRight} /> Liên Hệ</li>
                        </ul>
                    </div>

                    <div className={cx('footer-section', 'categories')}>
                        <h4>Danh Mục</h4>
                        <ul>
                            <li><FontAwesomeIcon icon={faChevronRight} /> Thời Trang Nam</li>
                            <li><FontAwesomeIcon icon={faChevronRight} /> Thời Trang Nữ</li>
                            <li><FontAwesomeIcon icon={faChevronRight} /> Phụ Kiện</li>
                            <li><FontAwesomeIcon icon={faChevronRight} /> Khuyến Mãi</li>
                        </ul>
                    </div>
                </div>
                
                <div className={cx('footer-bottom')}>
                    <p>&copy; 2025 NTPS_STORE. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
