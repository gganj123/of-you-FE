import React, { useRef, useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ProductCard from "../../../../common/components/ProductCard/ProductCard";
import './CategorySection.style.css';

const CategorySection = ({ categoryName, products }) => {
    const scrollRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 화면 크기에 따른 표시할 아이템 개수 설정
    const getItemsToShow = () => {
        if (windowWidth <= 480) return 4;
        if (windowWidth <= 768) return 6;
        if (windowWidth <= 1200) return 8;
        return products.length;
    };

    const itemsToShow = getItemsToShow();
    const displayedProducts = products.slice(0, itemsToShow);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleScroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmount = container.offsetWidth * 0.8;

        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            // 오른쪽 끝에서 첫 번째로 돌아오도록 처리
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="homepage-category-section">
            <div className="homepage-section-content">
                <div className="homepage-category-header">
                    <h2 className="homepage-category-title">{categoryName}</h2>
                    <a href="#" className="homepage-more-link">more ▶</a>
                </div>

                <div className="homepage-product-list-wrapper">
                    {windowWidth > 1200 && (
                        <button
                            className="category-nav-button category-prev-button"
                            onClick={() => handleScroll('left')}
                            aria-label="Previous products"
                        >
                            <IoChevronBack />
                        </button>
                    )}

                    <div className="homepage-product-list" ref={scrollRef}>
                        {displayedProducts.map(product => (
                            <div key={product.id} className="homepage-product-item">
                                <ProductCard
                                    image={product.image}
                                    title={product.title}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    discount={product.discount}
                                />
                            </div>
                        ))}
                    </div>

                    {windowWidth > 1200 && (
                        <button
                            className="category-nav-button category-next-button"
                            onClick={() => handleScroll('right')}
                            aria-label="Next products"
                        >
                            <IoChevronForward />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategorySection;
