import {useEffect, useMemo, useState} from 'react';
import ProductCard from '../../common/components/ProductCard/ProductCard';
import './LikePage.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {getLikeList} from '../../features/like/likeSlice';
import {getCategoryName} from '../../utils/categories';
import LoadingSpinner from '../../common/components/LoadingSpinner/LoadingSpinner';

const LikePage = () => {
  const dispatch = useDispatch();
  const {likes, loading, error} = useSelector((state) => state.like);

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('All');
  const [viewType, setViewType] = useState('grid');

  // 좋아요 리스트 가져오기
  useEffect(() => {
    dispatch(getLikeList()); // 좋아요 리스트 호출
  }, [dispatch]);

  const filteredLikes = useMemo(() => {
    return likes
      .filter((like) => like.productId)
      .filter((like) => like.productId._id && like.productId.image)
      .filter((like) => {
        if (activeTab === 'All') {
          return true;
        }
        return like.productId.category?.some((category) => getCategoryName(category) === getCategoryName(activeTab));
      });
  }, [likes, activeTab]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  // 좋아요 목록이 비어있는 경우
  if (filteredLikes.length === 0) {
    return (
      <div className='like-page'>
        <div className='like-page-header'>
          <h1 className='like-page-title'>MY♡ITEM (0)</h1>
          <div className='like-page-tabs'>
            <div className={`tab-button ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>
              All
            </div>
            <div
              className={`tab-button ${activeTab === 'WOMEN' ? 'active' : ''}`}
              onClick={() => setActiveTab('WOMEN')}>
              WOMEN
            </div>
            <div className={`tab-button ${activeTab === 'MEN' ? 'active' : ''}`} onClick={() => setActiveTab('MEN')}>
              MEN
            </div>
            <div className={`tab-button ${activeTab === 'LIFE' ? 'active' : ''}`} onClick={() => setActiveTab('LIFE')}>
              LIFE
            </div>
            <div
              className={`tab-button ${activeTab === 'BEAUTY' ? 'active' : ''}`}
              onClick={() => setActiveTab('BEAUTY')}>
              BEAUTY
            </div>
          </div>
        </div>
        <div className='empty-like'>
          <div className='empty-like-icon'>💝</div>
          <h2 className='empty-like-title'>
            {activeTab === 'All' ? '아직 좋아요한 상품이 없습니다' : `${activeTab} 카테고리에 좋아요한 상품이 없습니다`}
          </h2>
          <p className='empty-like-description'>
            하트를 눌러 마음에 드는 상품을
            <br />
            관심상품으로 저장해보세요
          </p>
          <button className='empty-like-button' onClick={() => (window.location.href = '/')}>
            상품 둘러보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='like-page'>
      <div className='like-page-header'>
        <h1 className='like-page-title'>MY♡ITEM ({filteredLikes.length})</h1>
        <div className='like-page-tabs'>
          <div className={`tab-button ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>
            All
          </div>
          <div className={`tab-button ${activeTab === 'WOMEN' ? 'active' : ''}`} onClick={() => setActiveTab('WOMEN')}>
            WOMEN
          </div>
          <div className={`tab-button ${activeTab === 'MEN' ? 'active' : ''}`} onClick={() => setActiveTab('MEN')}>
            MEN
          </div>
          <div className={`tab-button ${activeTab === 'LIFE' ? 'active' : ''}`} onClick={() => setActiveTab('LIFE')}>
            LIFE
          </div>
          <div
            className={`tab-button ${activeTab === 'BEAUTY' ? 'active' : ''}`}
            onClick={() => setActiveTab('BEAUTY')}>
            BEAUTY
          </div>
        </div>
      </div>

      <div className={`products-container ${viewType}`}>
        {filteredLikes.length > 0 ? (
          filteredLikes.map((like) => (
            <ProductCard
              key={like.productId._id}
              id={like.productId._id}
              image={like.productId.image}
              title={like.productId.name}
              realPrice={like.productId.realPrice}
              originalPrice={like.productId.price}
              discountRate={like.productId.saleRate}
            />
          ))
        ) : (
          <div className='empty-message'>No items found in this category.</div>
        )}
      </div>
    </div>
  );
};

export default LikePage;
