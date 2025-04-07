import classNames from 'classnames/bind';
import styles from './SideHome.module.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import imgBanner1 from '../../../assets/images/slider_1.webp';
import imgBanner2 from '../../../assets/images/slide-img1.webp';
import imgBanner3 from '../../../assets/images/slide-img3.webp';

const cx = classNames.bind(styles);

function SideHome() {
    const NextArrow = ({ onClick }) => {
        return (
            <div className={cx('arrow', 'next')} onClick={onClick}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
        );
    };

    const PrevArrow = ({ onClick }) => {
        return (
            <div className={cx('arrow', 'prev')} onClick={onClick}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </div>
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        pauseOnHover: true,
        dotsClass: cx('dots'),
        customPaging: () => (
            <div className={cx('dot')}></div>
        ),
    };

    return (
        <div className={cx('slide-container')}>
            <div className={cx('slider-wrapper')}>
                <Slider {...settings}>
                    <div className={cx('slide')}>
                        <div className={cx('image-wrapper')}>
                            <img src={imgBanner1} alt="Banner 1" />
                        </div>
                    </div>
                    <div className={cx('slide')}>
                        <div className={cx('image-wrapper')}>
                            <img src={imgBanner2} alt="Banner 2" />
                        </div>
                    </div>
                    <div className={cx('slide')}>
                        <div className={cx('image-wrapper')}>
                            <img src={imgBanner3} alt="Banner 3" />
                        </div>
                    </div>
                </Slider>
            </div>
        </div>
    );
}

export default SideHome;
