import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ProductCard from '../../common/components/ProductCard/ProductCard';
import {fetchProducts} from '../../features/product/productSlice';
import './CategoryPage.style.css';

const categories = {
  WOMEN: ['OUTERWEAR', 'TOP', 'BOTTOM', 'DRESS', 'ACCESSORIES'],
  MEN: ['OUTERWEAR', 'TOP', 'BOTTOM', 'ACCESSORIES'],
  BEAUTY: ['SKINCARE', 'MAKEUP', 'HAIR & BODY', 'DEVICES'],
  LIFE: ['HOME', 'TRAVEL', 'DIGITAL', 'CULTURE', 'FOOD']
};

const CategoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {category, subcategory} = useParams();

  const {products, loading, error} = useSelector((state) => state.products);

  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [sortType, setSortType] = useState('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const pageRef = useState(1); // 페이지 상태 관리
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
    // Redux Thunk로 상품 데이터 가져오기
    pageRef.current = 1; // 초기화
    dispatch(
      fetchProducts({
        category: categoryName,
        subcategory,
        page: 1,
        limit: productsPerPage,
        sort: sortType
      })
    );
    setHasMoreProducts(true);
  }, [sortType, category, subcategory, dispatch]);

  const loadMoreProducts = () => {
    if (!hasMoreProducts || loading) return;

    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;

    dispatch(
      fetchProducts({
        category: categoryName,
        subcategory,
        page: nextPage,
        limit: productsPerPage,
        sort: sortType
      })
    ).then((result) => {
      if (!result.payload || result.payload.length < productsPerPage) {
        setHasMoreProducts(false); // 더 이상 상품이 없으면 로드 중단
      }
    });
  };

  const handleSortChange = (newSortType) => {
    if (newSortType !== sortType) {
      setSortType(newSortType);
      setHasMoreProducts(true);
      pageRef.current = 1;
    }
  };

  const handleSubcategoryClick = (subcat) => {
    navigate(`/products/category/${category.toLowerCase()}/${subcat.toLowerCase()}`);
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreProducts();
    }

    setShowScrollToTopButton(scrollTop > 300);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMoreProducts, loading]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderSortButtons = () => {
    if (windowWidth > 1200) {
      return (
        <div className='category-page__sort'>
          <button
            className={`category-page__sort-btn ${sortType === 'latest' ? 'active' : ''}`}
            onClick={() => handleSortChange('latest')}>
            신상품순
          </button>
          <button
            className={`category-page__sort-btn ${sortType === 'discount' ? 'active' : ''}`}
            onClick={() => handleSortChange('discount')}>
            할인율순
          </button>
          <button
            className={`category-page__sort-btn ${sortType === 'priceAsc' ? 'active' : ''}`}
            onClick={() => handleSortChange('priceAsc')}>
            가격낮은순
          </button>
          <button
            className={`category-page__sort-btn ${sortType === 'priceDesc' ? 'active' : ''}`}
            onClick={() => handleSortChange('priceDesc')}>
            가격높은순
          </button>
        </div>
      );
    }
    return (
      <div className='category-page__sort-mobile'>
        <button className='category-page__sort-toggle' onClick={() => setIsSortOpen(!isSortOpen)}>
          {sortType === 'latest' && '신상품순'}
          {sortType === 'discount' && '할인율순'}
          {sortType === 'priceAsc' && '가격낮은순'}
          {sortType === 'priceDesc' && '가격높은순'}
          <span className={`arrow ${isSortOpen ? 'open' : ''}`}>▼</span>
        </button>
        {isSortOpen && (
          <div className='category-page__sort-dropdown'>
            <button
              className={`category-page__sort-btn ${sortType === 'latest' ? 'active' : ''}`}
              onClick={() => handleSortChange('latest')}>
              신상품순
            </button>
            <button
              className={`category-page__sort-btn ${sortType === 'discount' ? 'active' : ''}`}
              onClick={() => handleSortChange('discount')}>
              할인율순
            </button>
            <button
              className={`category-page__sort-btn ${sortType === 'priceAsc' ? 'active' : ''}`}
              onClick={() => handleSortChange('priceAsc')}>
              가격낮은순
            </button>
            <button
              className={`category-page__sort-btn ${sortType === 'priceDesc' ? 'active' : ''}`}
              onClick={() => handleSortChange('priceDesc')}>
              가격높은순
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='category-page'>
      <div className='category-page__header'>
        <h1 className='category-page__title'>{categoryName}</h1>
      </div>

      {subcategories.length > 0 && (
        <div className='category-page__subcategories'>
          <button
            className={`category-page__subcategory-btn ${!subcategory ? 'active' : ''}`}
            onClick={() => navigate(`/products/category/${category.toLowerCase()}`)}>
            ALL
          </button>
          {subcategories.map((subcat) => (
            <button
              key={subcat}
              className={`category-page__subcategory-btn ${subcategory?.toUpperCase() === subcat ? 'active' : ''}`}
              onClick={() => handleSubcategoryClick(subcat)}>
              {subcat}
            </button>
          ))}
        </div>
      )}

      {renderSortButtons()}

      <div className='category-page__product-grid'>
        {products.map((product) => (
          <div className='category-page__product-item' key={product.id}>
            <ProductCard
              id={product.id}
              image={product.image}
              brand={product.brand}
              title={product.title}
              salePrice={product.salePrice}
              originalPrice={product.originalPrice}
              discountRate={product.discountRate}
            />
          </div>
        ))}
      </div>
      {loading && <div className='category-page__loading'>상품을 불러오는 중입니다...</div>}
      {showScrollToTopButton && (
        <button className='category-page__scroll-top' onClick={scrollToTop}>
          ▲
        </button>
      )}
      {error && <div className='category-page__error'>에러 발생: {error.message}</div>}
    </div>
  );
};

export default CategoryPage;
