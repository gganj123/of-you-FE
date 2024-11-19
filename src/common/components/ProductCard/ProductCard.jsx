import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoHeartOutline, IoHeart} from 'react-icons/io5';
import './ProductCard.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {toggleLike} from '../../../features/like/likeSlice';

const ProductCard = ({id, image, title, salePrice, originalPrice, discountRate}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // `like`와 `products` 상태를 가져옴
  const {likes, loading: likeLoading, error: likeError} = useSelector((state) => state.like);
  const {products, loading: productLoading, error: productError} = useSelector((state) => state.products);

  const isLiked = likes.some((like) => like.productId === id);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLike(id)); // 좋아요/취소 액션 호출
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
          <span className='homepage-current-price'>{salePrice ? salePrice.toLocaleString() : '0'}원</span>
          {originalPrice && (
            <div className='homepage-price-discount'>
              <span className='homepage-original-price'>{originalPrice.toLocaleString()}원</span>
              <span className='homepage-discount'>-{discountRate ? discountRate : 0}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
