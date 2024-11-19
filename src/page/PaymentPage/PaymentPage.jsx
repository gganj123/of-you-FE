import React, { useState, useEffect } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import './PaymentPage.style.css';

const PaymentPage = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (e) => {
    setCardData(prev => ({ ...prev, focus: e.target.name }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="payment_wrapper">
      <div className="payment_title_area">
        <h1 className="payment_main_title">주문/결제</h1>
      </div>
      <div className="payment_container">
        {/* 왼쪽 영역 */}
        <div className="payment_content">
          <div className="payment_delivery_section">
            <h2 className="payment_section_title">배송지 정보</h2>
            <div className="payment_delivery_form">
              <div className="payment_form_row">
                <label className="payment_form_label">받으시는 분<span className="required">*</span></label>
                <input type="text" className="payment_form_input" />
              </div>
              <div className="payment_form_row">
                <label className="payment_form_label">휴대폰번호<span className="required">*</span></label>
                <div className="payment_phone_select">
                  <select className="payment_form_select">
                    <option value="" disabled selected>선택</option>
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="017">017</option>
                    <option value="018">018</option>
                    <option value="019">019</option>
                    <option value="070">070</option>
                  </select>
                  <input type="text" className="payment_form_input phone_input" maxLength="4" />
                  <input type="text" className="payment_form_input phone_input" maxLength="4" />
                </div>
              </div>
              <div className="payment_form_row">
                <label className="payment_form_label">배송지<span className="required">*</span></label>
                <input type="text" className="payment_form_input" />
                <button className="payment_form_button">우편번호 찾기</button>
              </div>
              <div className="payment_form_row">
                <label className="payment_form_label"></label>
                <input type="text" className="payment_form_input" />
              </div>
            </div>
          </div>

          <div className="payment_order_section">
            <h2 className="payment_section_title">주문상품</h2>
            <div className="payment_order_table">
              <div className="payment_order_header">
                <span>상품정보</span>
                <span>수량</span>
                <span>상품 금액</span>
                <span>총 상품 금액</span>
              </div>
              <div className="payment_order_item">
                <div className="payment_item_info">
                  <div className="payment_item_image">
                    <img src="/images/banner8.jpg" alt="Product" />
                  </div>
                  <div className="payment_item_details">
                    <div className="payment_brand">OLIVE DES OLIVE</div>
                    <div className="payment_item_name">벨티드 하프 발마칸 구스 다운 코트 OP4WMA670</div>
                    <div className="payment_item_option">옵션: BLACK_55_01</div>
                    <div className="payment_mobile_price">419,250원 / 2개</div>
                  </div>
                </div>
                <div className="payment_item_quantity">2</div>
                <div className="payment_price">
                  <span className="payment_price_original">559,000원</span>
                  <span className="payment_price_sale">419,250원</span>
                </div>
                <div className="payment_total_price">838,500원</div>
              </div>
              <p className="payment_delivery_notice">* 제주/도서산간 지역의 경우 추가 배송비가 발생할 수 있습니다.</p>
            </div>
          </div>

          {/* 카드 정보 섹션을 content 안으로 이동 */}
          <div className="payment_content_card_section">
            <h2 className="payment_section_title">카드 정보</h2>
            <div className="payment_card_form">
              <Cards
                number={cardData.number}
                expiry={cardData.expiry}
                cvc={cardData.cvc}
                name={cardData.name}
                focused={cardData.focus}
              />

              <div className="payment_form_row">
                <label className="payment_form_label">카드 번호<span className="required">*</span></label>
                <input
                  type="text"
                  name="number"
                  className="payment_form_input"
                  placeholder="0000 0000 0000 0000"
                  value={cardData.number}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  maxLength={16}
                />
              </div>

              <div className="payment_form_row">
                <label className="payment_form_label">카드 소유자<span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  className="payment_form_input"
                  placeholder="카드 소유자 이름"
                  value={cardData.name}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>

              <div className="payment_form_row">
                <label className="payment_form_label">유효기간<span className="required">*</span></label>
                <input
                  type="text"
                  name="expiry"
                  className="payment_form_input"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  maxLength={4}
                />
              </div>

              <div className="payment_form_row">
                <label className="payment_form_label">CVC<span className="required">*</span></label>
                <input
                  type="text"
                  name="cvc"
                  className="payment_form_input"
                  placeholder="CVC"
                  value={cardData.cvc}
                  onChange={handleInputChange}
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 - sticky */}
        <div className="payment_side">
          <div className="payment_summary_sticky">
            <div className="payment_summary_row">
              <span>총 상품 금액</span>
              <span>838,500원</span>
            </div>
            <div className="payment_summary_row">
              <span>배송비</span>
              <span>+ 0원</span>
            </div>
            <div className="payment_summary_row">
              <span>할인금액</span>
              <span>- 0원</span>
            </div>

            <div className="payment_total">
              <span>총 상품금액</span>
              <span className="payment_price_emphasis">838,500 원</span>
            </div>

            <button className="payment_button">
              결제하기
            </button>
          </div>
        </div>
      </div>
      {/* 하단 고정 결제 버튼 (1024px 이하일 때만 표시) */}
      {isMobileView && (
        <div className="payment_button_fixed">
          76,285원 결제하기
        </div>
      )}
    </div>
  );
};

export default PaymentPage;