import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './OrderCompletePage.style.css';

const OrderCompletePage = () => {
  const { order } = useSelector((state) => state.order);
  const navigate = useNavigate();

  const handleOrderDetail = () => {
    navigate('/mypage/order'); // 마이페이지 주문/배송조회 경로
  };

  const handleContinueShopping = () => {
    navigate('/'); // 메인 페이지 경로
  };

  return (
    <div className="order_complete_wrap">
      <div className="order_complete_inner">
        <div className="order_complete_line"></div>
        <div>
          <h2 className="order_complete_welcome">주문이 완료되었습니다.</h2>
          <p className="order_complete_number">주문번호 : {order}</p>
          <div className="order_complete_btn_wrap">
            <button
              className="order_complete_detail_btn"
              onClick={handleOrderDetail}
            >
              주문 상세보기
            </button>
            <button
              className="order_complete_btn"
              onClick={handleContinueShopping}
            >
              계속 쇼핑하러가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;