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
          <button className='cart-checkout-button'>주문하기</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
