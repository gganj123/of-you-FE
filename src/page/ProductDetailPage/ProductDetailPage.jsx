import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './ProductDetailPage.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {clearProductDetail, fetchProductDetail} from '../../features/product/productSlice';

const ProductDetailPage = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const {productDetail, loading, error} = useSelector((state) => state.products);

  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchProductDetail(id));

    return () => {
      dispatch(clearProductDetail());
    };
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!productDetail) {
    return <div>Product not found or loading failed.</div>;
  }

  const handleOptionSelect = (option) => {
    const exists = selectedOptions.find((item) => item.option === option);

    if (exists) {
      alert('이미 추가된 상품입니다. 주문 수량을 조정해주세요');
      setIsOptionOpen(false);

      return;
    }

    setSelectedOptions((prev) => [...prev, {option, quantity: 1}]);
    setIsOptionOpen(false);
  };

  const handleQuantityChange = (index, value) => {
    setSelectedOptions((prev) => prev.map((item, i) => (i === index ? {...item, quantity: Math.max(1, value)} : item)));
  };

  const handleRemoveOption = (index) => {
    setSelectedOptions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='product-detail-page'>
      <div className='product-detail-page__left'>
        <div className='product-detail-page__main-image'>
          <img src={productDetail.image} alt={productDetail.name} />
        </div>
      </div>
      <div className='product-detail-page__right'>
        <div className='product-detail-page__header'>
          <h1 className='product-detail-page__brand'>{productDetail.brand}</h1>
          <div className='product-detail-page__name'>{productDetail.name}</div>
        </div>

        <div className='product-detail-page__price'>
          {productDetail.price && (
            <div className={`product-detail-page__original-price ${productDetail.salePrice ? 'line-through' : ''}`}>
              {productDetail.price.toLocaleString()}원
            </div>
          )}
          {productDetail.salePrice && (
            <div className='product-detail-page__sale-price'>
              <span className='discount-rate'>{productDetail.discountRate}%</span>
              <span className='price'>{productDetail.salePrice.toLocaleString()}원</span>
            </div>
          )}
        </div>

        <div className='product-detail-page__benefits'>
          <div className='product-detail-page__benefit-item'>
            <span className='label'>신규회원</span>
            <span className='value'>신규가입 시 20% 쿠폰</span>
          </div>
          <div className='product-detail-page__benefit-item'>
            <span className='label'>추가혜택</span>
            <div className='value'>
              <div>Toss Pay 2000원 적립</div>
              <div className='sub-text'>토스포인트 적립 혜택</div>
            </div>
          </div>
        </div>

        <div className='product-detail-page__options'>
          <div className='product-detail-page__option-item'>
            <button className='product-detail-page__option-button' onClick={() => setIsOptionOpen(!isOptionOpen)}>
              옵션을 선택해주세요
              <span className='product-detail-page__arrow-down'>▼</span>
            </button>
            {isOptionOpen && (
              <div className='product-detail-page__option-dropdown'>
                {Object.entries(productDetail.stock).map(([option, quantity]) => (
                  <div
                    key={option}
                    className='product-detail-page__option-choice'
                    onClick={() => handleOptionSelect(option)}>
                    {option.trim()} (재고: {quantity})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedOptions.map((selected, index) => (
          <div key={index} className='product-detail-page__selected-option'>
            <span>
              {productDetail.name} / {selected.option}
            </span>
            <div className='product-detail-page__quantity'>
              <input
                type='number'
                value={selected.quantity}
                min='1'
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
              />
              <span>{(productDetail.salePrice || productDetail.price) * selected.quantity}원</span>
              <button className='product-detail-page__remove-option' onClick={() => handleRemoveOption(index)}>
                ✖
              </button>
            </div>
          </div>
        ))}

        <div className='product-detail-page__buttons'>
          <button className='product-detail-page__buy-now'>바로 구매</button>
          <button className='product-detail-page__add-cart'>장바구니 담기</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
