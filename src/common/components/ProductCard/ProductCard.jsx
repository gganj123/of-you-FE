import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoHeartOutline, IoHeart} from 'react-icons/io5';
import './ProductCard.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {toggleLike, toggleLikeOptimistic} from '../../../features/like/likeSlice';
import {throttle} from 'lodash';
import useCustomToast from '../../../utils/useCustomToast';

const ProductCard = ({id, image, title, realPrice, originalPrice, discountRate}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {likes} = useSelector((state) => state.like);
  const {user} = useSelector((state) => state.user);
  const {showInfo, showError} = useCustomToast();

  const isLiked = likes.some((like) => like.productId === id || like.productId?._id === id);

  const throttledLikeHandler = throttle((productId) => {
    dispatch(toggleLikeOptimistic(productId));
    dispatch(toggleLike(productId)).catch((error) => {
      console.error('좋아요 토글 실패:', error);
      dispatch(toggleLikeOptimistic(productId));
    });
  }, 300);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showInfo('로그인이 필요한 기능입니다.');
      return;
    }
    throttledLikeHandler(id);
  };
  const handleCardClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    } else {
      showError('상품 정보를 찾을 수 없습니다.');
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
