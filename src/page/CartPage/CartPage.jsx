import {useEffect} from 'react';
import {IoClose, IoChevronDown} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCart} from '../../features/cart/cartSlice'; // Redux actions
import './CartPage.style.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const {items, loading, error} = useSelector((state) => state.cart); // Redux state
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 486);
  const [temporaryQuantity, setTemporaryQuantity] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 486);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    // 장바구니 데이터를 로드
    dispatch(fetchCart());
  }, [dispatch]);

  // 체크된 상품만 계산
  const totalProductPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = 0;
  const totalDiscount = items.reduce((sum, item) => sum + (item.price * item.saleRate) / 100, 0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className='cart-wrapper'>
      <h1 className='cart-page-title'>장바구니 상품 ({items.length})</h1>

      <div className='cart-layout'>
        <div className='cart-list'>
          <div className='cart-list-header'>
            <div className='cart-list-header-info'>상품정보</div>
            <div>수량</div>
            <div>가격</div>
            <div></div>
          </div>

          {items.map((item) => (
            <div key={item.id} className='cart-list-item'>
              <div className='cart-item-content'>
                <img src={item.image} alt={item.name} className='cart-item-img' />
                <div className='cart-item-info'>
                  <div className='cart-item-brand'>{item.brand}</div>
                  <div className='cart-item-name'>{item.name}</div>
                  <div className='cart-item-option'>옵션 : {item.size}</div>
                </div>
              </div>
              <div className='cart-quantity-control'>
                <input type='text' value={item.qty} className='cart-quantity-input' readOnly />
              </div>
              <div className='cart-item-price'>
                {(item.price - (item.price * item.saleRate) / 100).toLocaleString()}원
              </div>
              <button className='cart-item-delete'>
                <IoClose />
              </button>
            </div>
          ))}

          <div className='cart-action-buttons'>
            <button className='cart-action-button cart-action-button-primary' onClick={handleDeleteSelected}>
              선택상품삭제
            </button>
            <button className='cart-action-button cart-action-button-secondary' onClick={handleContinueShopping}>

              쇼핑계속하기
            </button>
          </div>
        </div>

        <div className='cart-summary'>
          <div className='cart-summary-title'>총 상품 금액</div>
          <div className='cart-price-detail'>
            <div className='cart-price-row'>
              <span>총 상품 금액</span>
              <span>{totalProductPrice.toLocaleString()}원</span>
            </div>
            <div className='cart-price-row'>
              <span>배송비</span>
              <span>+{shippingFee.toLocaleString()}원</span>
            </div>
            <div className='cart-price-row'>
              <span>할인금액</span>
              <span>-{totalDiscount.toLocaleString()}원</span>
            </div>
            <div className='cart-price-row cart-price-row-total'>
              <span>총 결제금액</span>
              <span>{(totalProductPrice + shippingFee - totalDiscount).toLocaleString()}원</span>
            </div>
          </div>

          <button className="cart-checkout-button" onClick={handleCheckout}>주문하기</button>
        </div>
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
              <h2 className="cart-modal-title">{isMobile ? '옵션/수량' : '옵션변경'}</h2>
              <button className="cart-modal-close" onClick={handleCloseModal}>
                <IoClose />
              </button>
            </div>
            <div className="cart-modal-content">
              <div className="cart-option-group">
                {/* 옵션 선택 */}
                <div className="cart-option-select-wrapper">
                  <select
                    className="cart-option-select"
                    defaultValue={selectedProduct?.size}
                  >
                    <option value="FREE">FREE</option>
                  </select>
                </div>

                {/* 수량 조절 - 모바일에서만 표시 */}
                {isMobile && (
                  <div className="modal-quantity">
                    <div className="modal-quantity-title">수량</div>
                    <div className="modal-quantity-control">
                      <button
                        className="modal-quantity-down"
                        onClick={() => handleModalQuantityChange(-1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={temporaryQuantity}
                        className="modal-quantity-input"
                        readOnly
                      />
                      <button
                        className="modal-quantity-up"
                        onClick={() => handleModalQuantityChange(1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
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
                변경
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
