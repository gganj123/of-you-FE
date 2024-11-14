import React, {useState, useRef, useEffect} from 'react';
import {FiHeart, FiLogIn, FiUser, FiShoppingBag, FiSearch, FiChevronDown, FiMenu, FiArrowLeft} from 'react-icons/fi';
import './Navbar.style.css';

const Navbar = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('WOMAN');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPopularSearchVisible, setIsPopularSearchVisible] = useState(false);

  const popularSearchRef = useRef(null);

  const categories = {
    WOMAN: ['OUTERWEAR', 'TOP', 'BOTTOM', 'DRESS', 'ACCESSORIES'],
    MAN: ['OUTERWEAR', 'TOP', 'BOTTOM', 'ACCESSORIES'],
    BEAUTY: ['SKINCARE', 'MAKEUP', 'HAIR & BODY', 'DEVICES'],
    LIFE: ['HOME', 'TRAVEL', 'DIGITAL', 'CULTURE', 'FOOD']
  };

  const handleCategoryToggle = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
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

  // 인기 검색어 목록 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popularSearchRef.current && !popularSearchRef.current.contains(event.target)) {
        setIsPopularSearchVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className='navbar-container'>
        <div className='navbar-top-banner'>
          <img src='./images/banner-top.jpeg' alt='banner-top' className='navbar-top-banner-img' />
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
                        onClick={() => handleCategorySelect(category)}>
                        {category} {selectedCategory === category && <span className='navbar-arrow'>▶</span>}
                      </div>
                    ))}
                  </div>
                  {selectedCategory && (
                    <div className='navbar-subcategory-list'>
                      {categories[selectedCategory].map((subcategory) => (
                        <div key={subcategory} className='navbar-subcategory-item'>
                          {subcategory}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className='navbar-logo-container'>
              <img src='/images/logo.png' alt='logo' className='navbar-logo-image' />
            </div>
          </div>

          <div className='navbar-right-section'>
            <div className='navbar-search-bar'>
              <input type='text' placeholder='Search...' onFocus={handleSearchIconClick} />
              <FiSearch onClick={handleSearchIconClick} />
              {isPopularSearchVisible && (
                <div className='navbar-popular-search-list' ref={popularSearchRef}>
                  <h4>급상승 검색어</h4>
                  <ul>
                    {Array.from({length: 10}, (_, i) => (
                      <li key={`popular-${i}`}>{i + 1}. 검색어</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className='navbar-icons'>
              <div className='search-mobile-view' onClick={handleSearchIconClick}>
                <FiSearch />
                SEARCH
              </div>
              <div className='navbar-icon-item'>
                <FiHeart /> LIKE
              </div>
              <div className='navbar-icon-item'>
                <FiLogIn /> LOGIN
              </div>
              <div className='navbar-icon-item'>
                <FiUser /> MY
              </div>
              <div className='navbar-icon-item'>
                <FiShoppingBag /> 0
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
                    <div key={category} className='navbar-category-item' onClick={() => handleCategorySelect(category)}>
                      {category} {selectedCategory === category && <span className='navbar-arrow'>▶</span>}
                    </div>
                  ))}
                </div>
                {selectedCategory && (
                  <div className='navbar-subcategory-list'>
                    {categories[selectedCategory].map((subcategory) => (
                      <div key={subcategory} className='navbar-subcategory-item'>
                        {subcategory}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='navbar-menu'>
            <div className='navbar-menu-item'>WOMEN</div>
            <div className='navbar-menu-item'>MEN</div>
            <div className='navbar-menu-item'>BEAUTY</div>
            <div className='navbar-menu-item'>LIFE</div>
            <div className='navbar-divider'></div>
            <div className='navbar-menu-item'>BEST</div>
            <div className='navbar-menu-item'>SALE</div>
            <div className='navbar-menu-item'>NEW</div>
          </div>
        </div>
      </div>

      {/* 모바일 전용 하단 메뉴 */}
      <div className='mobile-navbar'>
        <div className='mobile-nav-item'>
          <FiArrowLeft />
          <span>BACK</span>
        </div>
        <div className='mobile-nav-item'>
          <FiHeart />
          <span>LIKE</span>
        </div>
        <div className='mobile-nav-item'>
          <FiLogIn />
          <span>LOGIN</span>
        </div>
        <div className='mobile-nav-item'>
          <FiUser />
          <span>MY</span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
