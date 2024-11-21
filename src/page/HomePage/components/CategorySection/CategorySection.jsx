import React, {useRef, useState, useEffect} from 'react';
import {IoChevronBack, IoChevronForward} from 'react-icons/io5';
import ProductCard from '../../../../common/components/ProductCard/ProductCard';
import './CategorySection.style.css';
import api from '../../../../utils/api'; // Axios 유틸리티를 가져옵니다.
import {fetchProducts, clearProducts} from '../../../../features/product/productSlice';
import {useDispatch, useSelector} from 'react-redux';

const categoryMapping = {
  MEN: '남성',
  WOMEN: '여성',
  BEAUTY: '뷰티',
  LIFE: '라이프'
};

const CategorySection = ({categoryName}) => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state) => state.products);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const translatedCategory = categoryMapping[categoryName?.toUpperCase?.()] || '기타';

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

  useEffect(() => {
    // 카테고리별 데이터를 가져오기
    const fetchCategoryProducts = async () => {
      if (!translatedCategory) {
        console.error(`Invalid category: ${categoryName}`);
        return;
      }
      dispatch(clearProducts()); // 이전 데이터 초기화

      dispatch(
        fetchProducts({
          category: translatedCategory, // 카테고리 이름
          page: 1, // 첫 페이지
          limit: 10 // 최대 10개
        })
      );
    };
    fetchCategoryProducts();
  }, [dispatch, categoryName]);

  const handleScroll = (direction) => {
    const container = document.querySelector(`.homepage-product-list-${categoryName}`);
    const scrollAmount = container.offsetWidth * 0.8;

    if (direction === 'left') {
      container.scrollBy({left: -scrollAmount, behavior: 'smooth'});
    } else {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollTo({left: 0, behavior: 'smooth'});
      } else {
        container.scrollBy({left: scrollAmount, behavior: 'smooth'});
      }
    }
  };

  return (
    <div className='homepage-category-section'>
      <div className='homepage-section-content'>
        <div className='homepage-category-header'>
          <h2 className='homepage-category-title'>{categoryName}</h2>
          <a href='#' className='homepage-more-link'>
            more ▶
          </a>
        </div>

        <div className='homepage-product-list-wrapper'>
          {windowWidth > 1200 && (
            <button
              className='category-nav-button category-prev-button'
              onClick={() => handleScroll('left')}
              aria-label='Previous products'>
              <IoChevronBack />
            </button>
          )}

          <div className={`homepage-product-list homepage-product-list-${categoryName}`}>
            {loading ? (
              <div className='category-page__loading'>상품을 불러오는 중입니다...</div>
            ) : error ? (
              <div className='category-page__error'>상품을 불러오는데 실패했습니다.</div>
            ) : (
              displayedProducts.map((product) => (
                <div key={product._id} className='homepage-product-item'>
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    image={product.image}
                    title={product.name}
                    realPrice={product.realPrice}
                    originalPrice={product.price}
                    discountRate={product.saleRate}
                  />
                </div>
              ))
            )}
          </div>

          {windowWidth > 1200 && (
            <button
              className='category-nav-button category-next-button'
              onClick={() => handleScroll('right')}
              aria-label='Next products'>
              <IoChevronForward />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
