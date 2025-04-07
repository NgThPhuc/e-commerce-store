import classNames from 'classnames/bind';
import styles from './Blogs.module.scss';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { requestGetBlogs } from '../../config/request';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Blogs() {
    const [dataBlogs, setDataBlogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetBlogs();
            setDataBlogs(res.metadata);
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>

            <div className={cx('blog-header')}>
                <h1>Bài Viết Mới Nhất</h1>
                <p>Cập nhật những xu hướng thời trang mới nhất</p>
            </div>

            <main className={cx('main-content')}>
                <div className={cx('blog-grid')}>
                    {dataBlogs.map((item) => (
                        <Link to={`/bai-viet/${item._id}`} key={item._id} className={cx('blog-card')}>
                            <div className={cx('image-wrapper')}>
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className={cx('card-content')}>
                                <div className={cx('meta-info')}>
                                    <span className={cx('date')}>
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                        {dayjs(item.createdAt).format('DD/MM/YYYY')}
                                    </span>
                                    <span className={cx('author')}>
                                        <FontAwesomeIcon icon={faUser} />
                                        Admin
                                    </span>
                                </div>
                                <h2>{item.title}</h2>
                                <div 
                                    className={cx('excerpt')} 
                                    dangerouslySetInnerHTML={{ 
                                        __html: item.content.length > 150 
                                            ? item.content.substring(0, 150) + '...' 
                                            : item.content 
                                    }} 
                                />
                                <div className={cx('read-more')}>
                                    Đọc thêm
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Blogs;
