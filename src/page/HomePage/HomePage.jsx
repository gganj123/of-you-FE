import React, {useEffect} from 'react';
import BannerSlider from './components/BannerSlider/BannerSlider';
import RecommendedProducts from './components/RecommendedProducts/RecommendedProducts';
import BrandBanner from './components/BrandBanner/BrandBanner';
import CategorySection from './components/CategorySection/CategorySection';
import './HomePage.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {getLikeList} from '../../features/like/likeSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user); // 로그인 상태 확인

  const baseProduct = {
    id: 1,
    image: '/images/banner8.jpg',
    brand: 'LOOKAST',
    title: 'LEANNE WOOL HANDMADE HALF COAT',
    salePrice: 143663,
    originalPrice: 298000,
    discountRate: 51
  };

  const recommendedProducts = Array.from({length: 16}, (_, index) => ({
    ...baseProduct,
    id: index + 1
  }));

  // 브랜드배너 데이터
  const brandBanners = [
    {
      image: '/images/brand1.jpg',
      title: 'SAINT JAMES',
      subtitle: '24FW WINTER COLLECTION',
      buttonText: '컬렉션 보러가기'
    },
    {
      image: '/images/brand2.jpg',
      title: 'ADIDAS',
      subtitle: 'LIMITED EDITION',
      buttonText: '상품 확인하기'
    }
  ];

  useEffect(() => {
    if (user) {
      // 로그인된 상태라면 좋아요 리스트 호출
      dispatch(getLikeList());
    }
  }, [user, dispatch]);

  return (
    <div className='homepage-container'>
      {/* 배너 슬라이더 */}

      <BannerSlider />

      {/* 배너 스트립 */}
      <div className='banner-strip-container'>
        <a className='banner-half'>
          <div className='banner-text'>
            <h3 className='banner-title'>SHOPPING REWARD</h3>
            <p className='banner-subtitle'>구매할수록 커지는 혜택</p>
          </div>
          <img src='/images/banner-strip1.jpg' alt='쇼핑 리워드' className='banner-image' />
        </a>
        <a className='banner-half'>
          <div className='banner-text'>
            <h3 className='banner-title'>WELCOME OF YOU</h3>
            <p className='banner-subtitle'>신규회원 스페셜 혜택 가이드</p>
          </div>
          <img src='/images/banner-strip2.jpg' alt='웰컴 혜택' className='banner-image' />
        </a>
      </div>

      {/* 추천 상품 */}
      <section className='recommended-products-section'>
        <h2 className='recommended-products-title'>ITEMS FOR YOU</h2>
        <p className='recommended-products-subtitle'>당신을 위한 추천상품</p>
        <CategorySection categoryName={'BEST'} />
      </section>
      {/* 브랜드배너 */}
      <BrandBanner banners={brandBanners} />

      <CategorySection categoryName={'여성'} />
      <CategorySection categoryName={'남성'} />
      <CategorySection categoryName={'뷰티'} />
      <CategorySection categoryName={'라이프'} />
    </div>
  );
};

export default HomePage;
