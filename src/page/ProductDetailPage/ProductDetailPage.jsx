import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from "../../common/components/ProductCard/ProductCard";
import './ProductDetailPage.style.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);

  // 임시 상품 데이터
  const productData = {
    id,
    brand: 'MaLoupe',
    name: '기모 밴딩 와이드 데님 (블랙)',
    originalPrice: 109000,
    discountRate: 20,
    salePrice: 87200,
    images: ['/images/banner6.jpg'],
    color: ['BLACK', 'WHITE'],
    size: ['S', 'M', 'L', 'XL']
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-page__left">
        <div className="product-detail-page__main-image">
          <img src={productData.images[selectedImage]} alt={productData.name} />
        </div>
        {/* <div className="product-detail-page__thumbnails">
          {productData.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`thumbnail ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={selectedImage === index ? 'active' : ''}
            />
          ))}
        </div> */}
      </div>
      <div className="product-detail-page__right">
        <div className="product-detail-page__header">
          <h1 className="product-detail-page__brand">{productData.brand}</h1>
          <div className="product-detail-page__name">{productData.name}</div>
        </div>
        <div className="product-detail-page__price">
          <div className="product-detail-page__original-price">{productData.originalPrice.toLocaleString()}원</div>
          <div className="product-detail-page__sale-price">
            <span className="discount-rate">{productData.discountRate}%</span>
            <span className="price">{productData.salePrice.toLocaleString()}원</span>
          </div>
        </div>

        <div className="product-detail-page__benefits">
          <div className="product-detail-page__benefit-item">
            <span className="label">신규회원</span>
            <span className="value">신규가입 시 20% 쿠폰</span>
          </div>
          <div className="product-detail-page__benefit-item">
            <span className="label">추가혜택</span>
            <div className="value">
              <div>Toss Pay 2000원 적립</div>
              <div className="sub-text">토스포인트 적립 혜택</div>
            </div>
          </div>
        </div>

        <div className="product-detail-page__options">
          <div className="product-detail-page__option-item">
            <button
              className="product-detail-page__option-button"
              onClick={() => setIsColorOpen(!isColorOpen)}
            >
              옵션을 선택해주세요
              <span className="product-detail-page__arrow-down">▼</span>
            </button>
            {isColorOpen && (
              <div className="product-detail-page__option-dropdown">
                {productData.color.map(color => (
                  <div key={color} className="product-detail-page__option-choice">{color}</div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="product-detail-page__buttons">
          <button className="product-detail-page__buy-now">바로 구매</button>
          <button className="product-detail-page__add-cart">장바구니 담기</button>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;