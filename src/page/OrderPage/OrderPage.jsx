// OrderPage.jsx
import React, { useState } from 'react';
import './OrderPage.style.css';

const OrderPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handlePeriodClick = (period) => {
        setSelectedPeriod(period);
        updateDateRange(period);
    };

    const updateDateRange = (period) => {
        const today = new Date();
        let startDate, endDate;

        switch (period) {
            case 'all':
                startDate = new Date('2008-01-01');
                endDate = today;
                break;
            case '1month':
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                endDate = today;
                break;
            case '2month':
                startDate = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
                endDate = today;
                break;
            case '3month':
                startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
                endDate = today;
                break;
            default:
                startDate = null;
                endDate = null;
        }

        setStartDate(startDate);
        setEndDate(endDate);
    };

    const dummyOrders = [
        {
            orderDate: '2024-01-01',
            orderNumber: 'Y05690390',
            productName: 'EIGHT DAYS A WEEK',
            productImage: '/images/banner10.jpg',
            productOption: 'SIZE FREE',
            quantity: 1,
            price: '59,800원',
            status: '배송완료'
        },
        {
            orderDate: '2024-02-15',
            orderNumber: 'Y05690391',
            productName: 'SPRING BREEZE',
            productImage: '/images/banner10.jpg',
            productOption: 'SIZE M',
            quantity: 2,
            price: '89,000원',
            status: '배송중'
        },
        {
            orderDate: '2024-03-01',
            orderNumber: 'Y05690392',
            productName: 'SUMMER NIGHTS',
            productImage: '/images/banner10.jpg',
            productOption: 'SIZE L',
            quantity: 1,
            price: '45,000원',
            status: '주문확인'
        }
    ];

    return (
        <div className="order-history-wrapper">
            <h1 className="order-history-title">주문/배송 조회</h1>

            <div className="order-history-header">
                <button
                    className={`order-history-filter-button ${selectedPeriod === 'all' ? 'active' : ''}`}
                    onClick={() => handlePeriodClick('all')}
                >
                    전체
                </button>
                <button
                    className={`order-history-filter-button ${selectedPeriod === '1month' ? 'active' : ''}`}
                    onClick={() => handlePeriodClick('1month')}
                >
                    1개월
                </button>
                <button
                    className={`order-history-filter-button ${selectedPeriod === '2month' ? 'active' : ''}`}
                    onClick={() => handlePeriodClick('2month')}
                >
                    2개월
                </button>
                <button
                    className={`order-history-filter-button ${selectedPeriod === '3month' ? 'active' : ''}`}
                    onClick={() => handlePeriodClick('3month')}
                >
                    3개월
                </button>
                <input
                    type="date"
                    className="order-history-date-input"
                    value={startDate ? startDate.toISOString().slice(0, 10) : ''}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                />
                <span>~</span>
                <input
                    type="date"
                    className="order-history-date-input"
                    value={endDate ? endDate.toISOString().slice(0, 10) : ''}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                />
                <button className="order-history-search-button">조회</button>
            </div>

            <div className="order-history-table">
                <div className="order-history-table-header">
                    <span>주문일</span>
                    <span>주문번호</span>
                    <span>상품정보</span>
                    <span>수량</span>
                    <span>상품금액</span>
                    <span>진행상황</span>
                </div>

                {dummyOrders.map((order) => (
                    <div key={order.orderNumber} className="order-history-table-row">
                        {/* PC 뷰 */}
                        <div className="pc-view">
                            <div className="order-history-order-date">{order.orderDate}</div>
                            <div className="order-history-order-number">{order.orderNumber}</div>
                            <div className="order-history-product-info">
                                <img src={order.productImage} alt="Product" className="order-history-product-image" />
                                <div className="order-history-product-details">
                                    <p className="order-history-product-name">{order.productName}</p>
                                    <p className="order-history-product-option">옵션: {order.productOption}</p>
                                </div>
                            </div>
                            <div className="order-history-quantity">{order.quantity}</div>
                            <div className="order-history-price">{order.price}</div>
                            <div className="order-history-order-status">{order.status}</div>
                        </div>

                        {/* 모바일 뷰 */}
                        <div className="mobile-view">
                            <div className="order-history-order-header">
                                <div className="order-history-order-date">{order.orderDate}</div>
                                <div className="order-history-order-number">{order.orderNumber}</div>
                            </div>

                            <div className="order-history-product-container">
                                <img src={order.productImage} alt="Product" className="order-history-product-image" />
                                <div className="order-history-product-details">
                                    <p className="order-history-product-name">{order.productName}</p>
                                    <p className="order-history-product-option">옵션: {order.productOption}</p>
                                    <div className="order-history-price-quantity">
                                        <span className="order-history-quantity">수량: {order.quantity}개</span>
                                        <span className="order-history-price">{order.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="order-history-status-review">
                                <div className="order-history-order-status">{order.status}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderPage;