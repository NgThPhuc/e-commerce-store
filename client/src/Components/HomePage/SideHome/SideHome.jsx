import classNames from 'classnames/bind';
import styles from './SideHome.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import imgBanner11 from '../../../assets/images/imgBanner11.png';
import imgBanner12 from '../../../assets/images/imgBanner12.png';
import imgBanner23 from '../../../assets/images/imgBanner13.png';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
                        <img src={imgBanner11} alt="Banner 1" />
                    </div>
                    <div className={cx('slide')}>
                        <img src={imgBanner12} alt="Banner 2" />
                    </div>
                    <div className={cx('slide')}>
                        <img src={imgBanner23} alt="Banner 3" />
                    </div>
                </Slider>
            </div>
        </div>
    );
}

export default SideHome;
