import React from 'react';
import './PaymentPage.style.css';

const PaymentPage = () => {
  return (
    <div className='payment_wrapper'>
      <div className='payment_container'>
        {/* 왼쪽 영역 */}
        <div className='payment_content'>
          <div className='payment_delivery_section'>
            <h2 className='payment_section_title'>배송지 정보</h2>
            <div className='payment_delivery_form'>
              <div className='payment_form_row'>
                <label className='payment_form_label'>
                  받으시는 분<span className='required'>*</span>
                </label>
                <input type='text' className='payment_form_input' />
              </div>
              <div className='payment_form_row'>
                <label className='payment_form_label'>
                  휴대폰번호<span className='required'>*</span>
                </label>
                <div className='payment_phone_select'>
                  <select className='payment_form_select'>
                    <option>선택</option>
                  </select>
                </div>
              </div>
              <div className='payment_form_row'>
                <label className='payment_form_label'>
                  배송지<span className='required'>*</span>
                </label>
                <input type='text' className='payment_form_input' />
                <button className='payment_form_button'>우편번호 찾기</button>
              </div>
            </div>
          </div>

          <div className='payment_order_section'>
            <h2 className='payment_section_title'>주문상품</h2>
            <div className='payment_order_item'>
              <div className='payment_item_image'>
                <img src='/images/banner8.jpg' alt='Product' />
              </div>
              <div className='payment_item_info'>
                <div className='payment_brand'>sienne</div>
                <div className='payment_item_name'>Jacque Hooded Sweatshirt (Wine)</div>
                <div className='payment_item_option'>옵션 : FREE</div>
                <div className='payment_item_quantity'>수량 1</div>
                <div className='payment_price_wrap'>
                  <span className='payment_price_original'>97,000 원</span>
                  <span className='payment_price_sale'>87,300 원</span>
                </div>
              </div>
            </div>
            <p className='payment_delivery_notice'>* 제주/도서산간 지역의 경우 추가 배송비가 발생할 수 있습니다.</p>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className='payment_side'>
          <div className='payment_summary_sticky'>
            <div className='payment_summary_row'>
              <span>총 상품 금액</span>
              <span>87,300원</span>
            </div>
            <div className='payment_summary_row'>
              <span>배송비</span>
              <span>+ 0원</span>
            </div>
            <div className='payment_summary_row'>
              <span>할인금액</span>
              <span>- 0원</span>
            </div>

            <div className='payment_total'>
              <span>총 상품금액</span>
              <span className='payment_price_emphasis'>87,300원</span>
            </div>

            <button className='payment_button'>결제하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
