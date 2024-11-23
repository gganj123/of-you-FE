import React, {useState, useRef, useEffect} from 'react';
import {
  FiHeart,
  FiLogIn,
  FiUser,
  FiShoppingBag,
  FiSearch,
  FiChevronDown,
  FiMenu,
  FiArrowLeft,
  FiSettings
} from 'react-icons/fi';
import './Navbar.style.css';
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loginWithToken, logout} from '../../../features/user/userSlice';
import {persistor} from '../../../features/store';
import {resetLikes} from '../../../features/like/likeSlice';
import {getCartList, getCartQty} from '../../../features/cart/cartSlice';
import {categories} from '../../../utils/categories';
import {getQuery} from '../../../features/query/querySlice';

const Navbar = ({user}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('WOMEN');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('PRODUCT');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPopularSearchVisible, setIsPopularSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const cartItemCount = useSelector((state) => state.cart.cartItemCount);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const {queries, queryLoading} = useSelector((state) => state.query);

  const popularSearchRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setIsCategoryOpen(false);
    setSearchTerm('');
    setIsPopularSearchVisible(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]);

  useEffect(() => {
    if (user) {
      dispatch(getCartQty());
      console.log('유저의 카트 카운트정보를 불러옵니다.', cartItemCount);
    }
  }, [dispatch, user]);

  const handleCategoryToggle = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };
  // 토글박스의 중분류 카테고리 선택을 위한 함수
  const handleSubCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSubCategoryClick = (category, subcategory) => {
    const categoryName = category.toLowerCase();
    const subCategoryName = subcategory.toLowerCase();
    navigate(`/products/category/${categoryName}/${subCategoryName}`);
    setIsCategoryOpen(false); // 메뉴 닫기
  };

  // 메뉴의 대분류 카테고리 페이지 이동을 위한 함수
  const handleCategoryPageNavigate = (category) => {
    navigate(`/products/category/${category.toLowerCase()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products/category/all?name=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleSearchIconClick = () => {
    if (window.innerWidth <= 1200) {
      // 모바일에서는 검색 모달 열기
      setIsSearchModalOpen(true);
    } else {
      // 피씨에서는 검색창 아래에 인기 검색어 표시
      setIsPopularSearchVisible(!isPopularSearchVisible);
    }
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleAdminCategorySelect = (category) => {
    navigate(`/admin/${category.toLowerCase()}`);
  };

  // 카테고리 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    persistor.pause(); // Redux Persist가 저장 작업을 멈추도록 설정
    persistor.purge(); // Redux Persist 상태 초기화
    localStorage.removeItem('persist:root');
    sessionStorage.clear();
    dispatch(resetLikes());
    dispatch(logout());
    dispatch(getCartList());
    dispatch(loginWithToken());
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLike = () => {
    navigate('mypage/like');
  };

  const handleCart = () => {
    navigate('/cart');
  };

  const handleMy = () => {
    navigate('/mypage');
  };

  const handleMain = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleAdmin = () => {
    navigate('/admin/product');
  };

  useEffect(() => {
    console.log('getQuery 요청');
    dispatch(getQuery());
  }, []);

  return (
    <>
      <div className='navbar-container'>
        <div className='navbar-top-banner'>
          <img src='/images/banner-top.jpeg' alt='banner-top' className='navbar-top-banner-img' />
          <div className='navbar-top-banner-text'>
            <div className='navbar-top-banner-text-line1'>차원이 다른 역대급 세일</div>
            <div className='navbar-top-banner-text-line2'>WEEK OF YOU</div>
          </div>
        </div>

        <div className='navbar-top-section'>
          <div className='navbar-left-section'>
            <div className='navbar-hamburger'>
              <button onClick={handleCategoryToggle}>
                <FiMenu className={`${isCategoryOpen ? 'rotate' : ''}`} />
              </button>
              {isCategoryOpen && (
                <div className='navbar-category-menu'>
                  <div className='navbar-category-list'>
                    {Object.keys(categories).map((category) => (
                      <div
                        key={category}
                        className='navbar-category-item'
                        onClick={() => handleSubCategorySelect(category)}>
                        {category} {selectedCategory === category && <span className='navbar-arrow'>▶</span>}
                      </div>
                    ))}
                  </div>
                  {selectedCategory && (
                    <div className='navbar-subcategory-list'>
                      {categories[selectedCategory].map((subcategory) => (
                        <div
                          key={subcategory}
                          className='navbar-subcategory-item'
                          onClick={() => handleSubCategoryClick(selectedCategory, subcategory)}>
                          {subcategory}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className='navbar-logo-container'>
              <img src='/images/logo.png' alt='logo' className='navbar-logo-image pointer' onClick={handleMain} />
            </div>
          </div>

          <div className='navbar-right-section'>
            <div className='navbar-search-bar'>
              <input
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                    setIsPopularSearchVisible(false);
                  }
                }}
                onFocus={handleSearchIconClick}
              />
              <FiSearch onClick={handleSearchIconClick} />
              {isPopularSearchVisible && (
                <div className='navbar-popular-search-list' ref={popularSearchRef}>
                  <h4>급상승 검색어</h4>
                  <ul>
                    {(queries || []).map((queryItem, index) => (
                      <li key={`popular-${index}`}>
                        {index + 1}. {queryItem.query}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className='navbar-icons'>
              {user && user.level === 'admin' && (
                <div className='navbar-icon-item' onClick={handleAdmin}>
                  <FiSettings /> ADMIN
                </div>
              )}
              <div className='search-mobile-view' onClick={handleSearchIconClick}>
                <FiSearch />
                SEARCH
              </div>
              <div className='navbar-icon-item' onClick={handleLike}>
                <FiHeart /> LIKE
              </div>
              {user ? (
                <div className='navbar-icon-item' onClick={handleLogout}>
                  <FiLogIn /> LOGOUT
                </div>
              ) : (
                <div className='navbar-icon-item' onClick={handleLogin}>
                  <FiLogIn /> LOGIN
                </div>
              )}

              <div className='navbar-icon-item' onClick={handleMy}>
                <FiUser /> {user ? user.name : 'MY'}
              </div>
              <div className='navbar-icon-item' onClick={handleCart}>
                <FiShoppingBag />
                <span className='cart-item-count'>{typeof cartItemCount === 'number' ? cartItemCount : 0}</span>{' '}
              </div>
            </div>
          </div>

          {/* 모바일 검색 모달 */}
          {isSearchModalOpen && (
            <div className='navbar-search-modal'>
              <div className='navbar-search-modal-content'>
                <button className='navbar-close-btn' onClick={handleCloseSearchModal}>
                  ×
                </button>
                <div className='navbar-search-input-container'>
                  <input type='text' placeholder='검색어를 입력하세요' className='navbar-search-modal-input' />
                  <FiSearch className='navbar-modal-search-icon' />
                </div>
                <div className='navbar-popular-searches'>
                  <h4>급상승 검색어</h4>
                  <ul>
                    {Array.from({length: 10}, (_, i) => (
                      <li key={`popular-${i}`}> {i + 1}. 검색어</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='navbar-bottom-section'>
          <div className='navbar-category-dropdown'>
            <button onClick={handleCategoryToggle} className='navbar-category-button'>
              CATEGORY <FiChevronDown className={`navbar-category-button-icon ${isCategoryOpen ? 'rotate' : ''}`} />
            </button>
            {isCategoryOpen && (
              <div className='navbar-category-menu'>
                <div className='navbar-category-list'>
                  {Object.keys(categories).map((category) => (
                    <div
                      key={category}
                      className='navbar-category-item'
                      onClick={() => handleSubCategorySelect(category)}>
                      {category} {selectedCategory === category && <span className='navbar-arrow'>▶</span>}
                    </div>
                  ))}
                </div>
                {selectedCategory && (
                  <div className='navbar-subcategory-list'>
                    {categories[selectedCategory].map((subcategory) => (
                      <div
                        key={subcategory}
                        className='navbar-subcategory-item'
                        onClick={() => handleSubCategoryClick(selectedCategory, subcategory)}>
                        {subcategory}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='navbar-menu'>
            {location.pathname.startsWith('/admin')
              ? ['PRODUCT', 'ORDER'].map((menuItem, index, array) => (
                  <React.Fragment key={menuItem}>
                    <div className='navbar-menu-item' onClick={() => handleAdminCategorySelect(menuItem)}>
                      {menuItem}
                    </div>
                    {index < array.length - 1 && <span className='navbar-menu-divider'>|</span>}
                  </React.Fragment>
                ))
              : ['WOMEN', 'MEN', 'BEAUTY', 'LIFE', 'BEST', 'SALE', 'NEW'].map((menuItem, index, array) => (
                  <React.Fragment key={menuItem}>
                    <div className='navbar-menu-item' onClick={() => handleCategoryPageNavigate(menuItem)}>
                      {menuItem}
                    </div>
                    {menuItem === 'LIFE' && index < array.length - 1 && <span className='navbar-menu-divider'>|</span>}
                  </React.Fragment>
                ))}
          </div>
        </div>
      </div>

      {/* 모바일 전용 하단 메뉴 */}
      <div className='mobile-navbar'>
        <div className='mobile-nav-item' onClick={handleBack}>
          <FiArrowLeft />
          <span>BACK</span>
        </div>
        <div className='mobile-nav-item' onClick={handleLike}>
          <FiHeart />
          <span>LIKE</span>
        </div>
        {user ? (
          <div className='mobile-nav-item' onClick={handleLogout}>
            <FiLogIn />
            <span>LOGOUT</span>
          </div>
        ) : (
          <div className='mobile-nav-item' onClick={handleLogin}>
            <FiLogIn />
            <span>LOGIN</span>
          </div>
        )}
        <div className='mobile-nav-item' onClick={handleMy}>
          <FiUser />
          <span>MY</span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
