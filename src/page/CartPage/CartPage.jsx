import React, { useState } from 'react';
import { IoClose, IoChevronDown } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './CartPage.style.css';

const CartPage = () => {
  const navigate = useNavigate();

  // 장바구니 상품 목록 상태
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      brand: 'sienne',
      name: 'Jacque Hooded Sweatshirt (Wine)',
      price: 87300,
      size: 'FREE',
      quantity: 1,
      image: '/images/banner8.jpg',
    },
    {
      id: 2,
      brand: 'sienne',
      name: '[단독] Patch Hooded Sweatshirt (Melange Grey)',
      price: 116100,
      size: 'FREE',
      quantity: 1,
      image: '/images/banner9.jpg',
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 체크된 상품만 계산
  const totalProductPrice = cartItems
    .filter(item => item.checked)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 0;
  const totalDiscount = 0;

  // 전체 선택 핸들러
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setCartItems(cartItems.map(item => ({
      ...item,
      checked: isChecked
    })));
  };

  // 개별 상품 선택 핸들러
  const handleSelectItem = (itemId) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  // 선택된 상품 삭제 핸들러
  const handleDeleteSelected = () => {
    if (!cartItems.some(item => item.checked)) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    if (window.confirm('선택한 상품을 삭제하시겠습니까?')) {
      setCartItems(cartItems.filter(item => !item.checked));
    }
  };

  // 쇼핑 계속하기
  const handleContinueShopping = () => {
    navigate('/'); // 메인 페이지로 이동
  };

  // 주문하기
  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.checked);

    if (selectedItems.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }

    // 주문 페이지로 이동하면서 선택된 상품 정보 전달
    navigate('/order', {
      state: {
        items: selectedItems,
        totalPrice: totalProductPrice,
        shippingFee,
        totalDiscount
      }
    });
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (itemId, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return item;
        return {
          ...item,
          quantity: newQuantity
        };
      }
      return item;
    }));
  };

  // 옵션 변경 관련 핸들러들...
  const handleOptionChange = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleApplyOption = () => {
    // 옵션 변경 로직 구현
    handleCloseModal();
  };

  // 개별 상품 삭제
  const handleRemoveItem = (itemId) => {
    if (window.confirm('이 상품을 삭제하시겠습니까?')) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    }
  };

  // 전체 선택 체크박스 상태
  const isAllChecked = cartItems.length > 0 && cartItems.every(item => item.checked);

  return (
    <div className="cart-wrapper">
      <h1 className="cart-page-title">장바구니 상품 ({cartItems.length})</h1>

      <div className="cart-layout">
        <div className="cart-list">
          <div className="cart-list-header">
            <div className="cart-item-checkbox">
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={handleSelectAll}
              />
            </div>
            <div className="cart-list-header-info">상품정보</div>
            <div>수량</div>
            <div>가격</div>
            <div></div>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-list-item">
              <div className="cart-item-checkbox">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleSelectItem(item.id)}
                />
              </div>
              <div className="cart-item-content">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-brand">{item.brand}</div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-option">옵션 : {item.size}</div>
                  <button
                    className="cart-option-change"
                    onClick={() => handleOptionChange(item)}
                  >
                    옵션변경 <IoChevronDown className="cart-option-change-icon" size={12} />
                  </button>
                </div>
              </div>
              <div className="cart-quantity-control">
                <input
                  type="text"
                  value={item.quantity}
                  className="cart-quantity-input"
                  readOnly
                />
                <div className="cart-quantity-buttons">
                  <button
                    className="cart-quantity-up"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <span className="cart-quantity-arrow">▲</span>
                  </button>
                  <button
                    className="cart-quantity-down"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <span className="cart-quantity-arrow">▼</span>
                  </button>
                </div>
              </div>
              <div className="cart-item-price">
                {item.price.toLocaleString()}원
              </div>
              <button
                className="cart-item-delete"
                onClick={() => handleRemoveItem(item.id)}
              >
                <IoClose />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-title">총 상품 금액</div>
          <div className="cart-price-detail">
            <div className="cart-price-row">
              <span>총 상품 금액</span>
              <span>{totalProductPrice.toLocaleString()}원</span>
            </div>
            <div className="cart-price-row">
              <span>배송비</span>
              <span>+{shippingFee.toLocaleString()}원</span>
            </div>
            <div className="cart-price-row">
              <span>할인금액</span>
              <span>-{totalDiscount.toLocaleString()}원</span>
            </div>
            <div className="cart-price-row cart-price-row-total">
              <span>총 결제금액</span>
              <span>{(totalProductPrice + shippingFee - totalDiscount).toLocaleString()}원</span>
            </div>
          </div>
          <button className="cart-checkout-button">주문하기</button>
        </div>
      </div>

      <div className="cart-action-buttons">
        <button
          className="cart-action-button cart-action-button-primary"
          onClick={handleDeleteSelected}
        >
          선택상품삭제
        </button>
        <button
          className="cart-action-button cart-action-button-secondary"
          onClick={handleContinueShopping}
        >
          쇼핑계속하기
        </button>
      </div>

      <div className="cart-notice">
        <ul className="cart-notice-list">
          <li className="cart-notice-item">쇼핑백에 담긴 상품은 최대 100개까지 담을 수 있습니다.</li>
          <li className="cart-notice-item">쇼핑백에 담긴 상품은 30일간 보관후 삭제됩니다.</li>
        </ul>
      </div>

      {/* 옵션 변경 모달 */}
      {isModalOpen && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <div className="cart-modal-header">
              <h2 className="cart-modal-title">옵션변경</h2>
              <button className="cart-modal-close" onClick={handleCloseModal}>
                <IoClose />
              </button>
            </div>
            <div className="cart-modal-content">
              <div className="cart-option-group">
                <div className="cart-option-select-wrapper">
                  <select
                    className="cart-option-select"
                    defaultValue={selectedProduct?.size}
                  >
                    <option value="FREE">FREE</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="cart-modal-footer">
              <button
                className="cart-modal-button cart-modal-button-cancel"
                onClick={handleCloseModal}
              >
                취소
              </button>
              <button
                className="cart-modal-button cart-modal-button-apply"
                onClick={handleApplyOption}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;