import classNames from 'classnames/bind';
import styles from './ProductSell.module.scss';

import { useEffect, useState } from 'react';
import { requestGetAllProducts } from '../../../config/request';
import CardBody from '../../CardBody/CardBody';
import {
    Shirt,
    UserCircle2,
    Baby,
    Gem,
    ShoppingBag,
    Store
} from 'lucide-react';

const cx = classNames.bind(styles);

const categories = [
    { icon: UserCircle2, name: 'Nam', link: '/men' },
    { icon: Shirt, name: 'Nữ', link: '/women' },
    { icon: Baby, name: 'Trẻ em', link: '/kids' },
    { icon: Gem, name: 'Phụ kiện', link: '/accessories' },
    { icon: ShoppingBag, name: 'Giày dép', link: '/footwear' }
];

const brands = [
    { name: 'Nike', icon: Store },
    { name: 'Adidas', icon: Store },
    { name: 'Puma', icon: Store },
    { name: "Levi's", icon: Store },
    { name: 'Zara', icon: Store },
    { name: 'H&M', icon: Store }
];

function ProductSell() {
    const [dataProducts, setDataProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetAllProducts();
            setDataProducts(res.metadata.products);
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <section className={cx('categories-section')}>
                <h2 className={cx('section-title')}>Danh mục sản phẩm</h2>
                <div className={cx('categories-grid')}>
                    {categories.map((category, index) => (
                        <a href={category.link} key={index} className={cx('category-card')}>
                            <div className={cx('category-icon')}>
                                <category.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3>{category.name}</h3>
                        </a>
                    ))}
                </div>
            </section>

            <section className={cx('brands-section')}>
                <h2 className={cx('section-title')}>Thương hiệu nổi bật</h2>
                <div className={cx('brands-grid')}>
                    {brands.map((brand, index) => (
                        <a href="#" key={index} className={cx('brand-card')}>
                            <div className={cx('brand-icon')}>
                                <brand.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3>{brand.name}</h3>
                        </a>
                    ))}
                </div>
            </section>

            {/* <section className={cx('products-section')}>
                <h2 className={cx('section-title')}>Sản phẩm mới</h2>
                <div className={cx('main-product')}>
                    {dataProducts.map((item, index) => (
                        <CardBody key={index} item={item} />
                    ))}
                </div>
            </section> */}
        </div>
    );
}

export default ProductSell;
