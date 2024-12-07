import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoHeartOutline, IoHeart} from 'react-icons/io5';
import './ProductCard.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {toggleLike, toggleLikeOptimistic} from '../../../features/like/likeSlice';
import {throttle} from 'lodash';
import useCustomToast from '../../../utils/useToast';

const ProductCard = ({id, image, title, realPrice, originalPrice, discountRate}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {likes} = useSelector((state) => state.like);
  const {user} = useSelector((state) => state.user);
  const {showInfo} = useCustomToast();
  const [isThrottling, setIsThrottling] = useState(false);

  const isLiked = likes.some((like) => like.productId === id || like.productId?._id === id);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showInfo('로그인이 필요한 기능입니다.');
      return;
    }
    // 요청 중일 경우 중단
    if (isThrottling) {
      return;
    }

    setIsThrottling(true); // 요청 중 상태 설정

    try {
      // 좋아요 요청 실행
      await dispatch(toggleLike(id));
    } catch (error) {
      if (error.response?.status === 400) {
        alert('이미 좋아요를 누르셨습니다.');
      } else {
        console.error('좋아요 요청 실패:', error);
      }
    } finally {
      setIsThrottling(false); // 요청 완료 후 상태 해제
    }
  };
  const handleCardClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    } else {
      alert('상품 정보를 찾을 수 없습니다.');
      console.error('Product ID is missing. Cannot navigate to the product detail page.');
    }
  };

  return (
    <div className='homepage-product-card' onClick={handleCardClick}>
      <div className='homepage-product-image-wrapper'>
        <div className='homepage-product-image-container'>
          <img src={image} alt={title} className='homepage-product-image' />
          <button
            className='homepage-product-like-button'
            onClick={handleLikeClick}
            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}>
            {isLiked ? <IoHeart className='like-icon like-icon-filled' /> : <IoHeartOutline className='like-icon' />}
          </button>
        </div>
      </div>
      <div className='homepage-product-info'>
        <h3 className='homepage-product-title'>{title}</h3>
        <div className='homepage-product-price'>
          <span className='homepage-current-price'>{realPrice ? realPrice.toLocaleString() : '0'}원</span>
          {originalPrice && (
            <div className='homepage-price-discount'>
              <span className='homepage-original-price'>{originalPrice.toLocaleString()}원</span>
              <span className='homepage-discount'>-{discountRate ? parseInt(discountRate.toFixed(0)) : 0}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
