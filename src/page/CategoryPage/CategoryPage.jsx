import {useEffect, useState} from 'react';
import {useParams, useNavigate, useSearchParams, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ProductCard from '../../common/components/ProductCard/ProductCard';
import {clearProducts, fetchProducts, searchProduct} from '../../features/product/productSlice';
import {categories, getCategoryName, getSubcategoryName} from '../../utils/categories';
import './CategoryPage.style.css';
import SkeletonCard from '../../common/components/SkeletonCard/SkeletonCard';

const CategoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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
  const skeletonArray = Array(12).fill(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!['new', 'best', 'sale'].includes(category)) {
      setSortType('latest');
    }
  }, [category]);

  useEffect(() => {
    const fetchParams = {
      mainCate: getCategoryName(category),
      subCate: subcategory ? getSubcategoryName(subcategory) : null,
      page: 1,
      limit: productsPerPage,
      sort: sortType,
      name: searchTerm
    };

    // 특정 메인 카테고리 처리
    if (['new', 'best', 'sale'].includes(category)) {
      const sortMapping = {
        new: 'latest',
        best: 'highPrice',
        sale: 'highSale'
      };
      const updatedSortType = sortMapping[category];
      setSortType(updatedSortType);

      // 검색 디스패치
      dispatch(
        searchProduct({
          ...fetchParams,
          mainCate: 'all', // 모든 상품 검색
          sort: updatedSortType
        })
      )
        .unwrap()
        .then((result) => {
          console.log('Search successful with result:', result);
        })
        .catch((err) => {
          console.error('Search failed with error:', err);
        });

      return; // `new`, `best`, `sale` 처리 후 나머지는 실행하지 않음
    }

    // 일반 카테고리 처리
    if (searchTerm) {
      console.log('Dispatching searchProduct with params:', fetchParams);
      dispatch(searchProduct(fetchParams))
        .unwrap()
        .then((result) => {
          console.log('Search successful with result:', result);
        })
        .catch((err) => {
          console.error('Search failed with error:', err);
        });
    } else {
      console.log('Dispatching fetchProducts with params:', fetchParams);
      dispatch(fetchProducts(fetchParams))
        .unwrap()
        .then((result) => {
          console.log('Fetch successful with result:', result);
        })
        .catch((err) => {
          console.error('Fetch failed with error:', err);
        });
    }
  }, [category, subcategory, searchParams, sortType, dispatch]);

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
  };

  const handleSubcategoryClick = (category, subcat) => {
    console.log('Navigating to:', `/products/category/${category}/${subcat}`);
    navigate(`/products/category/${category}/${subcat}`);
  };
  const loadMoreProducts = () => {
    if (!hasMoreProducts || loading) return;

    const nextPage = page + 1;

    // 검색어 여부에 따라 API 호출
    const fetchAction = searchTerm
      ? searchProduct({
          mainCate: getCategoryName(category),
          subCate: subcategory ? getSubcategoryName(subcategory) : null,
          page: nextPage,
          limit: productsPerPage,
          sort: sortType,
          name: searchTerm
        })
      : fetchProducts({
          mainCate: getCategoryName(category),
          subCate: subcategory ? getSubcategoryName(subcategory) : null,
          page: nextPage,
          limit: productsPerPage,
          sort: sortType
        });

    dispatch(fetchAction)
      .unwrap()
      .then((result) => {
        if (result.products?.length < productsPerPage) {
          setHasMoreProducts(false);
        }
        setPage(nextPage);

        // 상태에 데이터 추가
        dispatch({
          type: 'products/addMoreProducts',
          payload: {products: result.products} // API 응답 구조에 따라 적절히 수정
        });
      })
      .catch((err) => {
        console.error('Load more products failed:', err);
      });
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
              onClick={() => handleSubcategoryClick(category, subcat)}>
              {subcat}
            </button>
          ))}
        </div>
      )}

      {renderSortButtons()}

      <div className='category-page__product-grid'>
        {/* 초기 로딩 시 스켈레톤 UI 표시 */}
        {loading && products.length === 0
          ? skeletonArray.map((_, index) => (
              <div className='category-page__product-item' key={`skeleton-${index}`}>
                <SkeletonCard />
              </div>
            ))
          : // 상품 목록
            products.map((product) => (
              <div className='category-page__product-item' key={`${product._id}-${Math.random()}`}>
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

      {/* 무한 스크롤 로딩 스피너 */}
      {loading && products.length > 0 && (
        <div className='infinite-scroll-loader'>
          <div className='infinite-scroll-spinner'></div>
        </div>
      )}

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
