import {useState, useEffect} from 'react';
import {IoClose, IoChevronDown} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import './CartPage.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {deleteCartItem, getCartList, updateQty} from '../../features/cart/cartSlice';
import LoadingSpinner from '../../common/components/LoadingSpinner/LoadingSpinner';
import useCustomToast from '../../utils/useCustomToast';

const CartPage = () => {
  const dispatch = useDispatch();
  const {items, cartList, loading, error, totalPrice} = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 486);
  const [temporaryQuantity, setTemporaryQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [temporaryQuantities, setTemporaryQuantities] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(true);
  const {showInfo, showError} = useCustomToast();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 486);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setTemporaryQuantity(selectedProduct.qty);
    }
  }, [selectedProduct]);

  useEffect(() => {
    const initialCheckedState = {};
    cartList.forEach((item) => {
      initialCheckedState[item._id] = true;
    });
    setCheckedItems(initialCheckedState);
    setIsAllChecked(true);
  }, [cartList]);

  const totalCheckedPrice = cartList
    .filter((item) => checkedItems[item._id])
    .reduce((sum, item) => sum + item.productId.price * item.qty, 0);

  const totalCheckedDiscount = cartList
    .filter((item) => checkedItems[item._id])
    .reduce((sum, item) => {
      if (item.productId.realPrice) {
        const discount = (item.productId.price - item.productId.realPrice) * item.qty;
        return sum + discount;
      }
      return sum;
    }, 0);
  const hasCheckedItems = Object.values(checkedItems).some((isChecked) => isChecked);
  const shippingFee = hasCheckedItems ? 4000 : 0;
  const handleCheckout = () => {
    const selectedItems = cartList.filter((item) => checkedItems[item._id]);
    if (selectedItems.length === 0) {
      showInfo('주문할 상품을 선택해주세요.');
      return;
    }

    navigate('/payment', {
      state: {
        items: selectedItems,
        totalPrice: totalCheckedPrice,
        shippingFee,
        totalCheckedDiscount
      }
    });
  };
  const handleSelectItem = (itemId) => {
    setCheckedItems((prev) => {
      const newCheckedState = {...prev, [itemId]: !prev[itemId]};

      // 전체 체크박스 상태 업데이트
      const isAllChecked = cartList.every((item) => newCheckedState[item._id]);
      setIsAllChecked(isAllChecked);

      return newCheckedState;
    });
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      // 현재 전체 체크 상태이면 모든 체크 해제
      setCheckedItems({});
      setIsAllChecked(false);
    } else {
      // 현재 전체 체크 상태가 아니면 모든 체크 활성화
      const newCheckedState = {};
      cartList.forEach((item) => {
        newCheckedState[item._id] = true;
      });
      setCheckedItems(newCheckedState);
      setIsAllChecked(true);
    }
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('이 상품을 삭제하시겠습니까?')) {
      // Redux Thunk 호출
      dispatch(deleteCartItem(itemId)).catch((err) => {
        console.error('삭제 실패:', err);
      });
    }
  };

  const handleQuantityChange = (productId, size, change) => {
    const updatedCartList = cartList.map((item) =>
      item.productId._id === productId && item.size === size ? {...item, qty: Math.max(1, item.qty + change)} : item
    );
  };

  const handleModalQuantityChange = (change) => {
    const newQuantity = temporaryQuantity + change;
    if (newQuantity >= 1) {
      setTemporaryQuantity(newQuantity);
    }
  };

  const handleOptionChange = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setTemporaryQuantity(1);
  };

  const handleApplyOption = (newSize, newQty) => {
    if (!selectedProduct) return;

    dispatch(
      updateQty({
        cartItemId: selectedProduct._id, // 기존 cartItemId
        size: newSize,
        qty: newQty
      })
    )
      .unwrap()
      .then(() => {
        showInfo(`옵션이 변경되었습니다.`);
        setIsModalOpen(false); // 모달 닫기
        dispatch(getCartList());
      })
      .catch((err) => {
        console.error('옵션 변경 실패:', err);
        showInfo('옵션 변경에 실패했습니다.');
      });
  };

  const handleApplyQuantityChange = (itemId) => {
    const newQty = temporaryQuantities[itemId];
    if (newQty === undefined) {
      console.error('New quantity is undefined for cartItemId:', itemId);
      return;
    }

    dispatch(
      updateQty({
        cartItemId: itemId,
        qty: newQty
      })
    )
      .unwrap()
      .then(() => {
        showInfo(`수량이 ${newQty}개로 변경되었습니다.`);
        // 상태 초기화
        setTemporaryQuantities((prev) => {
          const {[itemId]: _, ...rest} = prev;
          return rest;
        });
        dispatch(getCartList());
      })
      .catch((err) => {
        console.error('수량 변경 실패:', err);
        showInfo('수량 변경에 실패했습니다.');
      });
  };

  const handlePickOption = (size) => {
    if (!selectedProduct) return;

    const selectedProductId = selectedProduct.productId._id;

    setSelectedProduct((prev) => ({
      ...prev,
      size
    }));
  };
  // 로딩 또는 에러 처리
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (cartList.length === 0) {
    return (
      <div className='cart-wrapper'>
        <h1 className='cart-page-title'>장바구니</h1>
        <div className='empty-cart'>
          <div className='empty-cart-icon'>🛒</div>
          <h2 className='empty-cart-title'>장바구니가 비어있습니다</h2>
          <p className='empty-cart-description'>
            OF YOU의 다양한 상품을 둘러보고
            <br />
            장바구니를 채워보세요!
          </p>
          <button className='empty-cart-button' onClick={() => navigate('/')}>
            쇼핑 계속하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='cart-wrapper'>
      <h1 className='cart-page-title'>장바구니 상품 ({cartList.length})</h1>
      <div className='cart-layout'>
        <div className='cart-list'>
          <div className='cart-list-header'>
            <div className='cart-item-checkbox'>
              <input type='checkbox' checked={isAllChecked} onChange={handleSelectAll} />
            </div>
            <div className='cart-list-header-info'>상품정보</div>
            {!isMobile && <div>수량</div>}
            <div className='cart-list-header-price'>가격</div>
          </div>

          {cartList.map((item) => (
            <div key={item._id} className='cart-list-item'>
              <div className='cart-item-checkbox'>
                <input
                  type='checkbox'
                  checked={!!checkedItems[item._id]} // 개별 체크박스 상태 연결
                  onChange={() => handleSelectItem(item._id)}
                />
              </div>
              <div className='cart-item-content'>
                <img src={item.productId.image} alt={item.productId.name} className='cart-item-img' />
                <div className='cart-item-info'>
                  <div className='cart-item-brand'>{item.productId.brand}</div>
                  <div className='cart-item-name'>{item.productId.name}</div>
                  <div className='cart-item-option'>
                    옵션 : {item.size} {isMobile ? ` 수량: ${item.qty}개` : ''}
                  </div>
                  {isMobile ? (
                    <div className='cart-item-mobile-bottom'>
                      <div className='cart-item-mobile-price'>
                        {item.productId.realPrice ? (
                          <>
                            <span
                              style={{
                                textDecoration: 'line-through',
                                color: 'gray',
                                marginRight: '8px'
                              }}>
                              {(item.productId.price * item.qty).toLocaleString()}원
                            </span>
                            <span style={{color: 'red', fontWeight: 'bold'}}>
                              {(item.productId.realPrice * item.qty).toLocaleString()}원
                            </span>
                          </>
                        ) : (
                          `${(item.productId.price * item.qty).toLocaleString()}원`
                        )}
                      </div>
                      <button className='cart-option-change' onClick={() => handleOptionChange(item)}>
                        옵션/수량변경 <IoChevronDown className='cart-option-change-icon' size={12} />
                      </button>
                    </div>
                  ) : (
                    <button className='cart-option-change' onClick={() => handleOptionChange(item)}>
                      옵션변경 <IoChevronDown className='cart-option-change-icon' size={12} />
                    </button>
                  )}
                </div>
              </div>
              {!isMobile && (
                <div className='pc-quantity-container'>
                  <div className='pc-quantity-box'>
                    <input
                      type='text'
                      className='pc-quantity-input'
                      value={temporaryQuantities[item._id] || item.qty}
                      readOnly
                    />
                    <div className='pc-quantity-buttons'>
                      <button
                        className='pc-quantity-up'
                        onClick={() =>
                          setTemporaryQuantities((prev) => {
                            const currentQuantity = prev[item._id] || item.qty;
                            const stockLimit = item.productId.stock[item.size];
                            if (currentQuantity + 1 > stockLimit) {
                              showInfo(`최대 ${stockLimit}개까지 구매 가능합니다.`);
                              return {...prev, [item._id]: stockLimit};
                            }
                            return {...prev, [item._id]: currentQuantity + 1};
                          })
                        }>
                        ▲
                      </button>
                      <button
                        className='pc-quantity-down'
                        onClick={() =>
                          setTemporaryQuantities((prev) => ({
                            ...prev,
                            [item._id]: Math.max(1, (prev[item._id] || item.qty) - 1)
                          }))
                        }>
                        ▼
                      </button>
                    </div>
                  </div>
                  <button
                    className='pc-quantity-apply'
                    onClick={() => {
                      handleApplyQuantityChange(item._id);
                    }}>
                    변경
                  </button>
                </div>
              )}

              {!isMobile && (
                <div className='cart-item-price'>
                  {item.productId.realPrice ? (
                    <>
                      <div className='original-price'>{(item.productId.price * item.qty).toLocaleString()}원</div>
                      <div className='sale-price'>{(item.productId.realPrice * item.qty).toLocaleString()}원</div>
                    </>
                  ) : (
                    <div className='normal-price'>{(item.productId.price * item.qty).toLocaleString()}원</div>
                  )}
                </div>
              )}
              <button className='cart-item-delete' onClick={() => handleRemoveItem(item._id)}>
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
              <span>{totalCheckedPrice.toLocaleString()}원</span>
            </div>
            <div className='cart-price-row'>
              <span>배송비</span>
              <span>+{shippingFee.toLocaleString()}원</span>
            </div>
            <div className='cart-price-row'>
              <span>할인금액</span>
              <span>-{totalCheckedDiscount.toLocaleString()}원</span>
            </div>
            <div className='cart-price-row cart-price-row-total'>
              <span>총 결제금액</span>
              <span>{(totalCheckedPrice + shippingFee - totalCheckedDiscount).toLocaleString()}원</span>
            </div>
          </div>

          <button
            className={`cart-checkout-button ${
              Object.values(checkedItems).some((isChecked) => isChecked) ? 'active' : 'disabled'
            }`}
            onClick={handleCheckout}
            disabled={!Object.values(checkedItems).some((isChecked) => isChecked) || cartList.length === 0}>
            주문하기
          </button>
        </div>
      </div>
      <div className='cart-notice'>
        <ul className='cart-notice-list'>
          <li className='cart-notice-item'>쇼핑백에 담긴 상품은 최대 100개까지 담을 수 있습니다.</li>
          <li className='cart-notice-item'>쇼핑백에 담긴 상품은 30일간 보관후 삭제됩니다.</li>
        </ul>
      </div>
      {/* 옵션 변경 모달 */}
      {isModalOpen && (
        <div className='cart-modal-overlay'>
          <div className='cart-modal'>
            <div className='cart-modal-header'>
              <h2 className='cart-modal-title'>{isMobile ? '옵션/수량' : '옵션변경'}</h2>
              <button className='cart-modal-close' onClick={handleCloseModal}>
                <IoClose />
              </button>
            </div>
            <div className='cart-modal-content'>
              <div className='cart-option-group'>
                <select value={selectedProduct.size} onChange={(e) => handlePickOption(e.target.value)}>
                  {Object.keys(selectedProduct.productId.stock).map((size) => (
                    <option
                      key={size}
                      value={size}
                      disabled={cartList.some(
                        (item) => item.productId._id === selectedProduct.productId._id && item.size === size
                      )}>
                      {size} (재고: {selectedProduct.productId.stock[size]})
                    </option>
                  ))}
                </select>
                {isMobile && (
                  <div className='modal-quantity'>
                    <div className='modal-quantity-control'>
                      <button
                        className='modal-quantity-down'
                        onClick={() => setTemporaryQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}>
                        -
                      </button>
                      <input type='number' value={temporaryQuantity} className='modal-quantity-input' readOnly />
                      <button
                        className='modal-quantity-up'
                        onClick={() =>
                          setTemporaryQuantity((prevQuantity) => {
                            const stockLimit = selectedProduct.productId.stock[selectedProduct.size];
                            if (prevQuantity + 1 > stockLimit) {
                              showInfo(`최대 ${stockLimit}개까지 구매 가능합니다.`);
                              return stockLimit;
                            }
                            return prevQuantity + 1;
                          })
                        }>
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='cart-modal-footer'>
              <button className='cart-modal-button cart-modal-button-cancel' onClick={handleCloseModal}>
                취소
              </button>
              <button
                className='cart-modal-button cart-modal-button-apply'
                onClick={() => handleApplyOption(selectedProduct.size, temporaryQuantity)}>
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
