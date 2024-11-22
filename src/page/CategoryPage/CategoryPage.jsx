import {useEffect, useState} from 'react';
import {useParams, useNavigate, useSearchParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ProductCard from '../../common/components/ProductCard/ProductCard';
import {clearProducts, fetchProducts} from '../../features/product/productSlice';
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
  const [searchParams] = useSearchParams();
  const {products, loading, error} = useSelector((state) => state.products);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [sortType, setSortType] = useState('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [page, setPage] = useState(1);

  const pageRef = useState(1); // 페이지 상태 관리
  const productsPerPage = 50;
  const searchTerm = searchParams.get('name') || ''; // 검색어 가져오기
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
    dispatch(clearProducts());
    pageRef.current = 1;
    setHasMoreProducts(true);

    const fetchParams = {
      category: categoryName,
      subcategory,
      page: 1,
      limit: productsPerPage,
      sort: searchParams.get('sort') || sortType,
      name: searchTerm
    };

    dispatch(fetchProducts(fetchParams));
  }, [categoryName, subcategory, searchParams, dispatch]); // searchParams 추가

  const handleCategoryClick = (newCategory) => {
    navigate(`/products/category/${newCategory.toLowerCase()}`);
  };

  const handleSubcategoryClick = (subcat) => {
    const params = new URLSearchParams(searchParams);
    params.delete('subcategory');
    params.set('subcategory', subcat.toLowerCase());
    navigate(`/products/category/${category.toLowerCase()}?${params.toString()}`);
  };
  const loadMoreProducts = () => {
    if (!hasMoreProducts || loading || products.length === 0 || searchTerm) return;

    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;

    dispatch(
      fetchProducts({
        category: categoryName,
        subcategory,
        page: nextPage,
        limit: productsPerPage,
        sort: sortType,
        name: searchTerm
      })
    ).then((result) => {
      if (!result.payload || result.payload.length < productsPerPage) {
        setHasMoreProducts(false); // 더 이상 상품이 없으면 로드 중단
      }
    });
  };

  const handleSortChange = (newSortType) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSortType);
    navigate(`/products/category/${category.toLowerCase()}?${params.toString()}`);
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
            className={`category-page__sort-btn ${sortType === '' ? 'active' : ''}`}
            onClick={() => handleSortChange('')}>
            신상품순
          </button>
          <button
            className={`category-page__sort-btn ${sortType === 'highSale' ? 'active' : ''}`}
            onClick={() => handleSortChange('highSale')}>
            할인율순
          </button>
          <button
            className={`category-page__sort-btn ${sortType === 'lowPrice' ? 'active' : ''}`}
            onClick={() => handleSortChange('lowPrice')}>
            가격낮은순
          </button>
          <button
            className={`category-page__sort-btn ${sortType === 'highPrice' ? 'active' : ''}`}
            onClick={() => handleSortChange('highPrice')}>
            가격높은순
          </button>
        </div>
      );
    }
    return (
      <div className='category-page__sort-mobile'>
        <button className='category-page__sort-toggle' onClick={() => setIsSortOpen(!isSortOpen)}>
          {sortType === '' && '신상품순'}
          {sortType === 'highSale' && '할인율순'}
          {sortType === 'lowPrice' && '가격낮은순'}
          {sortType === 'highPrice' && '가격높은순'}
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
              className={`category-page__sort-btn ${sortType === 'highSale' ? 'active' : ''}`}
              onClick={() => handleSortChange('highSale')}>
              할인율순
            </button>
            <button
              className={`category-page__sort-btn ${sortType === 'lowPrice' ? 'active' : ''}`}
              onClick={() => handleSortChange('lowPrice')}>
              가격낮은순
            </button>
            <button
              className={`category-page__sort-btn ${sortType === 'highPrice' ? 'active' : ''}`}
              onClick={() => handleSortChange('highPrice')}>
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
          <div className='category-page__product-item' key={product._id}>
            <ProductCard
              id={product._id}
              image={product.image}
              brand={product.brand}
              title={product.name}
              realPrice={product.realPrice}
              originalPrice={product.price}
              discountRate={product.saleRate}
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
