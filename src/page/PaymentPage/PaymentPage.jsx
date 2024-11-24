import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import './PaymentPage.style.css';
import {cc_expires_format} from '../../utils/number';
import {useDispatch, useSelector} from 'react-redux';
import {createOrder} from '../../features/order/orderSlice';
import {getAddressList} from '../../features/address/addressSlice';
import DaumPostcode from 'react-daum-postcode';
import LoadingSpinner from '../../common/components/LoadingSpinner/LoadingSpinner';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {items, totalPrice} = location.state || {items: [], totalPrice: 0};
  const {addresses, loading: addressLoading} = useSelector((state) => state.address);
  const {loading: orderLoading} = useSelector((state) => state.order);

  const [isMobileView, setIsMobileView] = useState(false);
  const [shipInfo, setShipInfo] = useState({
    address: '',
    city: '',
    zip: '',
    firstName: '',
    lastName: '',
    contact: ''
  });

  const [contactParts, setContactParts] = useState({
    prefix: '',
    middle: '',
    last: ''
  });

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: ''
  });

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleFormChange = (e) => {
    const {name, value} = e.target;
    setShipInfo({...shipInfo, [name]: value});
  };

  useEffect(() => {
    dispatch(getAddressList()); // 컴포넌트 마운트 시 주소 목록 가져오기
  }, [dispatch]);

  useEffect(() => {
    // 기본 배송지를 초기 선택 주소로 설정
    const defaultAddress = addresses.find((address) => address.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
      updateFormWithAddress(defaultAddress);
    }
  }, [addresses]);

  const updateFormWithAddress = (address) => {
    setShipInfo({
      ...shipInfo,
      address: address.shipto.address,
      city: address.shipto.city,
      zip: address.shipto.zip,
      firstName: address.contact.firstName,
      lastName: address.contact.lastName,
      contact: `${address.contact.prefix}-${address.contact.middle}-${address.contact.last}`
    });
    setContactParts({
      prefix: address.contact.prefix,
      middle: address.contact.middle,
      last: address.contact.last
    });
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    updateFormWithAddress(address);
  };

  // ==================

  const handleContactChange = (e) => {
    const {name, value} = e.target;
    const updatedContactParts = {
      ...contactParts,
      [name]: value
    };
    const updatedContact = `${updatedContactParts.prefix || ''}-${updatedContactParts.middle || ''}-${
      updatedContactParts.last || ''
    }`;

    setContactParts(updatedContactParts);
    setShipInfo((prev) => ({
      ...prev,
      contact: updatedContact
    }));
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;

    if (name === 'number' && value.length > 16) {
      return; // 16자 초과 시 무시
    }

    const formattedValue = name === 'expiry' ? cc_expires_format(value) : value;

    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleInputFocus = (e) => {
    setCardData((prev) => ({...prev, focus: e.target.name}));
  };

  const handleCompletePostcode = (data) => {
    const fullAddress = data.address; // 도로명 주소
    const zonecode = data.zonecode; // 우편번호

    setShipInfo((prev) => ({
      ...prev,
      address: fullAddress, // 도로명 주소
      zip: zonecode, // 우편번호
      city: '' // 상세 주소는 비워둠
    }));

    setIsPostcodeOpen(false); // 모달 닫기
  };

  const handleSubmitOrder = () => {
    if (
      !shipInfo.address ||
      !shipInfo.city ||
      !shipInfo.zip ||
      !shipInfo.firstName ||
      !shipInfo.lastName ||
      !shipInfo.contact ||
      cardData.number.length !== 16 || // 카드 번호는 정확히 16자리여야 함
      cardData.expiry.length !== 5 ||
      cardData.cvc.length !== 3 ||
      !cardData.name
    ) {
      alert('모든 입력란을 정확히 채워주세요.');
      return;
    }
    // 주문 데이터 형식에 맞게 변환
    const orderData = {
      shipto: {
        address: shipInfo.address,
        city: shipInfo.city,
        zip: shipInfo.zip
      },
      contact: {
        firstName: shipInfo.firstName,
        lastName: shipInfo.lastName,
        contact: shipInfo.contact
      },
      orderList: items.map((item) => ({
        productId: item.productId._id,
        size: item.size,
        qty: item.qty,
        price: item.productId.price,
        cartId: item._id
      })),
      totalPrice: totalPrice
    };

    console.log('Order Data:', orderData); // 디버깅용

    // createOrder 액션 호출
    dispatch(createOrder(orderData));
    navigate('/payment/success');
  };
  useEffect(() => {
    if (!location.state || !items || items.length === 0) {
      navigate('/cart'); // 데이터가 없으면 장바구니로 리디렉션
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (items.length === 0) {
    navigate('/cart');
  }

  if (addressLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='payment_wrapper'>
      <div className='payment_title_area'>
        <h1 className='payment_main_title'>주문/결제</h1>
      </div>
      <div className='payment_container'>
        <div className='payment_content'>
          <div className='payment_delivery_section'>
            <h2 className='payment_section_title'>배송지 정보</h2>

            <select
              className='payment-address-select'
              value={selectedAddress ? selectedAddress._id : ''}
              onChange={(e) => handleAddressSelect(addresses.find((addr) => addr._id === e.target.value))}>
              <option value=''>배송지 선택</option>
              {addresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.contact.lastName}
                  {address.contact.firstName} - {address.isDefault ? '(기본배송지) ' : ''}
                  {address.shipto.address}
                </option>
              ))}
            </select>

            <div className='payment_delivery_form'>
              {/* 성명 입력 */}
              <div className='payment_form_row name_row'>
                <label className='payment_form_label'>
                  받으시는 분<span className='required'>*</span>
                </label>
                <div className='name_input_group'>
                  <div className='name_input_box'>
                    <input
                      type='text'
                      className='payment_form_input'
                      onChange={handleFormChange}
                      name='lastName'
                      placeholder='성'
                      value={shipInfo.lastName}
                    />
                  </div>
                  <input
                    type='text'
                    className='payment_form_input'
                    onChange={handleFormChange}
                    name='firstName'
                    placeholder='이름'
                    value={shipInfo.firstName}
                  />
                </div>
              </div>

              {/* 연락처 입력 */}
              <div className='payment_form_row'>
                <label className='payment_form_label'>
                  휴대폰번호<span className='required'>*</span>
                </label>
                <div className='payment_phone_select'>
                  <select
                    className='payment_form_select'
                    name='prefix'
                    value={contactParts.prefix}
                    onChange={handleContactChange}>
                    <option value='' disabled>
                      선택
                    </option>
                    <option value='010'>010</option>
                    <option value='011'>011</option>
                    <option value='016'>016</option>
                    <option value='017'>017</option>
                    <option value='018'>018</option>
                    <option value='019'>019</option>
                  </select>
                  <input
                    type='text'
                    className='payment_form_input phone_input'
                    name='middle'
                    value={contactParts.middle}
                    onChange={handleContactChange}
                    maxLength='4'
                  />
                  <input
                    type='text'
                    className='payment_form_input phone_input'
                    name='last'
                    value={contactParts.last}
                    onChange={handleContactChange}
                    maxLength='4'
                  />
                </div>
              </div>

              {/* 주소 입력 */}
              <div className='payment_form_row address_row'>
                <label className='payment_form_label'>
                  배송지<span className='required'>*</span>
                </label>
                <div className='address_input_group'>
                  <div className='zipcode_row'>
                    <input
                      type='text'
                      className='payment_form_input zipcode_input'
                      placeholder='우편번호'
                      value={shipInfo.zip}
                      readOnly
                    />
                    <button className='payment_form_button' type='button' onClick={() => setIsPostcodeOpen(true)}>
                      우편번호 찾기
                    </button>
                  </div>
                  <input
                    type='text'
                    className='payment_form_input'
                    placeholder='도로명 주소'
                    value={shipInfo.address}
                    readOnly
                  />
                  <input
                    type='text'
                    className='payment_form_input'
                    placeholder='상세 주소'
                    value={shipInfo.city}
                    onChange={(e) => setShipInfo((prev) => ({...prev, city: e.target.value}))}
                  />
                </div>
              </div>

              {/* 우편번호 모달 */}
              {isPostcodeOpen && (
                <div className='postcode_overlay'>
                  <div className='postcode_modal'>
                    <div className='postcode_modal_header'>
                      <h3 className='postcode_modal_title'>우편번호 찾기</h3>
                      <button className='close_button' onClick={() => setIsPostcodeOpen(false)}>
                        ✕
                      </button>
                    </div>
                    <div className='postcode_content'>
                      <DaumPostcode onComplete={handleCompletePostcode} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='payment_order_section'>
            <h2 className='payment_section_title'>주문상품</h2>
            <div className='payment_order_table'>
              <div className='payment_order_header'>
                <span>상품정보</span>
                <span>수량</span>
                <span>상품 금액</span>
                <span>총 상품 금액</span>
              </div>
              {items.map((item, index) => {
                // 안전하게 데이터를 처리
                const product = item.productId || {};
                const price = product.realPrice || product.price || 0; // salePrice가 없으면 price 사용, 둘 다 없으면 0
                const totalPrice = price * (item.qty || 1); // qty가 없으면 기본값 1

                return (
                  <div className='payment_order_item' key={item._id}>
                    <div className='payment_item_info'>
                      <div className='payment_item_image'>
                        <img src={product.image || '/images/default-image.jpg'} alt={product.name || '상품 이미지'} />
                      </div>
                      <div className='payment_item_details'>
                        <div className='payment_brand'>{product.brand || '브랜드 없음'}</div>
                        <div className='payment_item_name'>{product.name || '상품명 없음'}</div>
                        <div className='payment_item_option'>옵션: {item.size || '옵션 없음'}</div>
                        <div className='payment_mobile_price'>
                          {price ? `${totalPrice.toLocaleString()}원 / ${item.qty || 1}개` : '가격 정보 없음'}
                        </div>
                      </div>
                    </div>
                    <div className='payment_item_quantity'>{item.qty || 1}</div>
                    <div className='payment_price'>
                      {product.realPrice ? (
                        <>
                          <span className='payment_price_original'>{product.price?.toLocaleString() || 0}원</span>
                          <span className='payment_price_sale'>{product.realPrice?.toLocaleString() || 0}원</span>
                        </>
                      ) : (
                        <span className='payment_price_sale'>{product.price?.toLocaleString() || 0}원</span>
                      )}
                    </div>
                    <div className='payment_total_price'>{totalPrice.toLocaleString()}원</div>
                  </div>
                );
              })}
              <p className='payment_delivery_notice'>* 제주/도서산간 지역의 경우 추가 배송비가 발생할 수 있습니다.</p>
            </div>
          </div>

          {/* 카드 정보 섹션 */}
          <div className='payment_content_card_section'>
            <h2 className='payment_section_title'>카드 정보</h2>
            <div className='payment_card_form'>
              <Cards
                number={cardData.number}
                expiry={cardData.expiry}
                cvc={cardData.cvc}
                name={cardData.name}
                focused={cardData.focus}
              />
              <div className='payment_form_row'>
                <label className='payment_form_label'>
                  카드 번호<span className='required'>*</span>
                </label>
                <input
                  type='text'
                  name='number'
                  className='payment_form_input'
                  placeholder='0000 0000 0000 0000'
                  value={cardData.number}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  maxLength={16}
                />
              </div>
              <div className='payment_form_row'>
                <label className='payment_form_label'>
                  카드 소유자<span className='required'>*</span>
                </label>
                <input
                  type='text'
                  name='name'
                  className='payment_form_input'
                  placeholder='카드 소유자 이름'
                  value={cardData.name}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
              <div className='payment_form_row'>
                <label className='payment_form_label'>
                  유효기간<span className='required'>*</span>
                </label>
                <input
                  type='text'
                  name='expiry'
                  className='payment_form_input'
                  placeholder='MM/YY'
                  value={cardData.expiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  maxLength={5}
                />
              </div>
              <div className='payment_form_row'>
                <label className='payment_form_label'>
                  CVC<span className='required'>*</span>
                </label>
                <input
                  type='text'
                  name='cvc'
                  className='payment_form_input'
                  placeholder='CVC'
                  value={cardData.cvc}
                  onChange={handleInputChange}
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className='payment_side'>
          <div className='payment_summary_sticky'>
            <div className='payment_summary_row'>
              <span>총 상품 금액</span>
              <span>
                {items.reduce((sum, item) => sum + (item.productId.price || 0) * (item.qty || 1), 0).toLocaleString()}원
              </span>
            </div>
            <div className='payment_summary_row'>
              <span>배송비</span>
              <span>+ 4000원</span>
            </div>
            <div className='payment_summary_row'>
              <span>할인금액</span>
              <span>
                -{' '}
                {items
                  .filter((item) => item.productId.realPrice)
                  .reduce((sum, item) => sum + (item.productId.price - item.productId.realPrice) * item.qty, 0)
                  .toLocaleString()}
                원
              </span>
            </div>
            <div className='payment_total'>
              <span>총 결제 금액</span>
              <span className='payment_price_emphasis'>
                {(
                  items.reduce((sum, item) => sum + (item.productId.price || 0) * (item.qty || 1), 0) -
                  items
                    .filter((item) => item.productId.realPrice)
                    .reduce((sum, item) => sum + (item.productId.price - item.productId.realPrice) * item.qty, 0) +
                  4000
                ).toLocaleString()}
                원
              </span>
            </div>

            <button className='payment_button' onClick={handleSubmitOrder} disabled={orderLoading}>
              {orderLoading ? '결제 처리중...' : '결제하기'}
            </button>
            {orderLoading && (
              <div className='payment-loading-overlay'>
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
