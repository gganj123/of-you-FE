import {useState, useEffect} from 'react';
import {IoClose, IoChevronDown} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import './CartPage.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {deleteCartItem, getCartList, updateQty} from '../../features/cart/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const {items, loading, error} = useSelector((state) => state.cart); // Redux state
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 486);
  const [temporaryQuantity, setTemporaryQuantity] = useState(1);
  const {cartList, totalPrice} = useSelector((state) => state.cart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [temporaryQuantities, setTemporaryQuantities] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(true);

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
      initialCheckedState[item._id] = true; // 모든 항목 체크
    });
    setCheckedItems(initialCheckedState);
    setIsAllChecked(true); // 전체 체크박스 활성화
  }, [cartList]);

  const totalCheckedPrice = cartList
    .filter((item) => checkedItems[item._id]) // 체크된 항목만 필터링
    .reduce((sum, item) => sum + item.productId.price * item.qty, 0);

  const totalCheckedDiscount = cartList
    .filter((item) => checkedItems[item._id]) // 체크된 항목만 필터링
    .reduce((sum, item) => {
      if (item.productId.salePrice) {
        // 할인 금액 계산
        const discount = (item.productId.price - item.productId.salePrice) * item.qty;
        return sum + discount;
      }
      return sum;
    }, 0);
  const hasCheckedItems = Object.values(checkedItems).some((isChecked) => isChecked);
  const shippingFee = hasCheckedItems ? 4000 : 0;

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
        alert('상품 삭제에 실패했습니다.');
      });
    }
  };

  const handleQuantityChange = (productId, size, change) => {
    const updatedCartList = cartList.map((item) =>
      item.productId._id === productId && item.size === size ? {...item, qty: Math.max(1, item.qty + change)} : item
    );
    console.log('Updated Cart List:', updatedCartList);
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
    dispatch(
      updateQty({
        productId: selectedProduct.productId._id,
        size: newSize,
        qty: newQty
      })
    );
    setIsModalOpen(false); // 모달 닫기
  };

  const handleApplyQuantityChange = (cartItemId, productId, size) => {
    const newQty = temporaryQuantities[cartItemId]; // 임시 수량 가져오기
    if (newQty === undefined) return; // 변경된 값이 없으면 아무 작업도 하지 않음

    dispatch(
      updateQty({
        productId,
        size,
        qty: newQty // 새로운 수량 전달
      })
    )
      .then(() => {
        alert('수량이 변경되었습니다.');
      })
      .catch(() => {
        alert('수량 변경에 실패했습니다.');
      });
  };

  const handlePickOption = (size) => {
    if (!selectedProduct) return;

    setSelectedProduct((prev) => ({
      ...prev,
      size // 선택된 옵션 업데이트
    }));
    console.log(`옵션 변경: ${size}, 상품 ID: ${selectedProduct.productId._id}`);
  };
  const handleCheckout = () => {
    if (cartList.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }
    navigate('/payment', {
      state: {
        items: cartList,
        totalPrice: totalCheckedPrice,
        shippingFee,
        totalCheckedDiscount
      }
    });
  };

  // 로딩 또는 에러 처리
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
                  <div className='cart-item-option'>옵션 : {item.size}</div>
                  {isMobile ? (
                    <div className='cart-item-mobile-bottom'>
                      <div className='cart-item-mobile-price'>
                        {item.productId.salePrice ? (
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
                              {(item.productId.salePrice * item.qty).toLocaleString()}원
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
                <div className='pc-quantity-control'>
                  <input
                    type='number'
                    value={temporaryQuantities[item._id] || item.qty} // 로컬 상태에 수량 저장
                    className='pc-quantity-input'
                    onChange={(e) => {
                      const inputQuantity = parseInt(e.target.value) || 1; // 사용자가 입력한 값
                      const stockLimit = item.productId.stock[item.size]; // 해당 상품 옵션의 최대 재고
                      console.log(stockLimit);
                      if (inputQuantity > stockLimit) {
                        // 초과 시 경고 메시지 및 최대값으로 제한
                        alert(`최대 ${stockLimit}개까지 구매 가능합니다.`);
                        setTemporaryQuantities((prev) => ({
                          ...prev,
                          [item._id]: stockLimit // 최대 재고로 강제 설정
                        }));
                      } else {
                        // 유효한 값 업데이트
                        setTemporaryQuantities((prev) => ({
                          ...prev,
                          [item._id]: Math.max(1, inputQuantity)
                        }));
                      }
                    }}
                  />
                  <div className='pc-quantity-buttons'>
                    <button
                      className='pc-quantity-up'
                      onClick={() =>
                        setTemporaryQuantities((prev) => {
                          const currentQuantity = prev[item._id] || item.qty;
                          const stockLimit = item.productId.stock[item.size];
                          if (currentQuantity + 1 > stockLimit) {
                            alert(`최대 ${stockLimit}개까지 구매 가능합니다.`);
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
                  <button
                    className='pc-quantity-apply'
                    onClick={() => handleApplyQuantityChange(item._id, item.productId._id, item.size)}>
                    변경
                  </button>
                </div>
              )}

              {!isMobile && (
                <div className='cart-item-price'>
                  {item.productId.salePrice ? (
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
                        {(item.productId.salePrice * item.qty).toLocaleString()}원
                      </span>
                    </>
                  ) : (
                    `${(item.productId.price * item.qty).toLocaleString()}원`
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

          <button className='cart-checkout-button' onClick={handleCheckout}>
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
                {/* 옵션 선택 */}
                <div className='cart-option-select-wrapper'>
                  <select
                    value={selectedProduct.size}
                    onChange={(e) => handlePickOption(e.target.value, selectedProduct.qty)}>
                    {Object.keys(selectedProduct.productId.stock).map((size) => (
                      <option key={size} value={size}>
                        {size} (재고: {selectedProduct.productId.stock[size]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 수량 조절 - 모바일에서만 표시 */}
                {isMobile && (
                  <div className='modal-quantity'>
                    <div className='modal-quantity-title'>수량</div>
                    <div className='modal-quantity-control'>
                      <button
                        className='modal-quantity-down'
                        onClick={() => setTemporaryQuantity(Math.max(1, temporaryQuantity - 1))}>
                        -
                      </button>
                      <input type='number' value={temporaryQuantity} className='modal-quantity-input' readOnly />
                      <button className='modal-quantity-up' onClick={() => setTemporaryQuantity(temporaryQuantity + 1)}>
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
