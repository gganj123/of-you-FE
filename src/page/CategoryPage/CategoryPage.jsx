import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from "../../common/components/ProductCard/ProductCard";
import './CategoryPage.style.css';

const categories = {
    WOMEN: ['OUTERWEAR', 'TOP', 'BOTTOM', 'DRESS', 'ACCESSORIES'],
    MEN: ['OUTERWEAR', 'TOP', 'BOTTOM', 'ACCESSORIES'],
    BEAUTY: ['SKINCARE', 'MAKEUP', 'HAIR & BODY', 'DEVICES'],
    LIFE: ['HOME', 'TRAVEL', 'DIGITAL', 'CULTURE', 'FOOD']
};

const CategoryPage = () => {
    const navigate = useNavigate();
    const { category, subcategory } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
    const [sortType, setSortType] = useState('latest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const pageRef = useRef(1);
    const productsPerPage = 50;

    const categoryName = category ? category.toUpperCase() : 'ALL';
    const subcategories = categories[categoryName] || [];

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchProducts(1);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sortType, category, subcategory]);

    const fetchProducts = (page) => {
        setIsLoading(true);
        const data = Array.from({ length: productsPerPage }, (_, index) => ({
            id: (page - 1) * productsPerPage + index + 1,
            image: '/images/banner7.jpg',
            brand: 'H&M',
            title: `Product ${index + 1}`,
            salePrice: 29900 + index * 1000,
            originalPrice: 39900 + index * 1000,
            discountRate: 25,
            likeCount: Math.floor(Math.random() * 100),
            isFree: Math.random() > 0.5,
            createdAt: new Date(Date.now() - Math.random() * 10000000000)
        }));

        const sortedData = sortProducts(data);

        setProducts((prevProducts) => {
            const newProducts = [...prevProducts, ...sortedData];
            return newProducts.slice(0, 50);
        });
        setIsLoading(false);

        if (data.length < productsPerPage || products.length >= 50) {
            setHasMoreProducts(false);
        }

        pageRef.current += 1;
    };

    const sortProducts = (data) => {
        switch (sortType) {
            case 'latest':
                return [...data].sort((a, b) => b.createdAt - a.createdAt);
            case 'priceAsc':
                return [...data].sort((a, b) => a.price - b.price);
            case 'priceDesc':
                return [...data].sort((a, b) => b.price - a.price);
            case 'discount':
                return [...data].sort((a, b) => b.discount - a.discount);
            default:
                return data;
        }
    };

    const handleSortChange = (newSortType) => {
        if (newSortType !== sortType) {
            setSortType(newSortType);
            setProducts([]);
            pageRef.current = 1;
            setHasMoreProducts(true);
            if (windowWidth <= 1200) {
                setIsSortOpen(false);
            }
        }
    };

    const handleSubcategoryClick = (subcat) => {
        navigate(`/products/category/${category.toLowerCase()}/${subcat.toLowerCase()}`);
        setProducts([]);
        pageRef.current = 1;
        setHasMoreProducts(true);
    };

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 200 && hasMoreProducts && !isLoading) {
            fetchProducts(pageRef.current);
        }

        if (scrollTop > 300) {
            setShowScrollToTopButton(true);
        } else {
            setShowScrollToTopButton(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const renderSortButtons = () => {
        if (windowWidth > 1200) {
            return (
                <div className="category-page__sort">
                    <button
                        className={`category-page__sort-btn ${sortType === 'latest' ? 'active' : ''}`}
                        onClick={() => handleSortChange('latest')}
                    >
                        신상품순
                    </button>
                    <button
                        className={`category-page__sort-btn ${sortType === 'discount' ? 'active' : ''}`}
                        onClick={() => handleSortChange('discount')}
                    >
                        할인율순
                    </button>
                    <button
                        className={`category-page__sort-btn ${sortType === 'priceAsc' ? 'active' : ''}`}
                        onClick={() => handleSortChange('priceAsc')}
                    >
                        가격낮은순
                    </button>
                    <button
                        className={`category-page__sort-btn ${sortType === 'priceDesc' ? 'active' : ''}`}
                        onClick={() => handleSortChange('priceDesc')}
                    >
                        가격높은순
                    </button>
                </div>
            );
        } else {
            return (
                <div className="category-page__sort-mobile">
                    <button
                        className="category-page__sort-toggle"
                        onClick={() => setIsSortOpen(!isSortOpen)}
                    >
                        {sortType === 'latest' && '신상품순'}
                        {sortType === 'discount' && '할인율순'}
                        {sortType === 'priceAsc' && '가격낮은순'}
                        {sortType === 'priceDesc' && '가격높은순'}
                        <span className={`arrow ${isSortOpen ? 'open' : ''}`}>▼</span>
                    </button>
                    {isSortOpen && (
                        <div className="category-page__sort-dropdown">
                            <button
                                className={`category-page__sort-btn ${sortType === 'latest' ? 'active' : ''}`}
                                onClick={() => handleSortChange('latest')}
                            >
                                신상품순
                            </button>
                            <button
                                className={`category-page__sort-btn ${sortType === 'discount' ? 'active' : ''}`}
                                onClick={() => handleSortChange('discount')}
                            >
                                할인율순
                            </button>
                            <button
                                className={`category-page__sort-btn ${sortType === 'priceAsc' ? 'active' : ''}`}
                                onClick={() => handleSortChange('priceAsc')}
                            >
                                가격낮은순
                            </button>
                            <button
                                className={`category-page__sort-btn ${sortType === 'priceDesc' ? 'active' : ''}`}
                                onClick={() => handleSortChange('priceDesc')}
                            >
                                가격높은순
                            </button>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="category-page">
            <div className="category-page__header">
                <h1 className="category-page__title">{categoryName}</h1>
            </div>

            {subcategories.length > 0 && (
                <div className="category-page__subcategories">
                    <button
                        className={`category-page__subcategory-btn ${!subcategory ? 'active' : ''}`}
                        onClick={() => navigate(`/products/category/${category.toLowerCase()}`)}
                    >
                        ALL
                    </button>
                    <span className="category-page__divider">|</span>

                    {subcategories.map((subcat, index) => (
                        <React.Fragment key={subcat}>
                            <button
                                className={`category-page__subcategory-btn ${subcategory?.toUpperCase() === subcat ? 'active' : ''}`}
                                onClick={() => handleSubcategoryClick(subcat)}
                            >
                                {subcat}
                            </button>
                            {index < subcategories.length - 1 && (
                                <span className="category-page__divider">|</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {renderSortButtons()}

            <div className="category-page__product-grid">
                {products.map((product) => (
                    <div className="category-page__product-item" key={product.id}>
                        <ProductCard
                            id={product.id}
                            image={product.image}
                            brand={product.brand}
                            title={product.title}
                            salePrice={product.salePrice}
                            originalPrice={product.originalPrice}
                            discountRate={product.discountRate}
                            likeCount={product.likeCount}
                        />
                    </div>
                ))}
            </div>
            {isLoading && <div className="category-page__loading">
                상품을 불러오는 중입니다...
            </div>}
            {showScrollToTopButton && (
                <button className="category-page__scroll-top" onClick={scrollToTop}>
                    ▲
                </button>
            )}
        </div>
    );
};

export default CategoryPage;