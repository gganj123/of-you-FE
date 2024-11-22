import React, {useState, useEffect} from 'react';
import {Form, Modal, Button, Row, Col, Alert} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import '../AdminProductPage.style.css';
import {getCategoryName} from '../../../utils/categories';

import 'bootstrap/dist/css/bootstrap.min.css';
import CloudinaryUploadWidget from '../../../utils/CloudinaryUploadWidget.jsx';
// import {CATEGORY, STATUS, SIZE} from '../../../constants/product.constants';
import {clearError, createProduct, updateProduct} from '../../../features/product/productSlice';
import CategoryDialog from './CategoryDialog';

const InitialFormData = {
  name: '',
  sku: '',
  stock: {},
  image: '',
  description: '',
  category: [],
  status: 'active',
  price: 0
};

const NewItemDialog = ({mode, showDialog, setShowDialog}) => {
  const {error, success, selectedProduct} = useSelector((state) => state.products);
  const [formData, setFormData] = useState(mode === 'new' ? {...InitialFormData} : selectedProduct);
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [category, setCategory] = useState([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  useEffect(() => {
    if (success) {
      handleClose();
    }
  }, [success]);

  const handleClose = () => {
    //모든걸 초기화시키고;
    // 다이얼로그 닫아주기
    setStockError(false);
    setPriceError(false);
    setCategoryError(false);
    setFormData({...InitialFormData});
    setStock([]);
    setShowDialog(false);
  };

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === 'edit') {
        setFormData(selectedProduct);
        console.log(selectedProduct);
        // 객체형태로 온 stock을  다시 배열로 세팅해주기
        const sizeArray = Object.keys(selectedProduct.stock).map((size) => [size, selectedProduct.stock[size]]);
        setStock(sizeArray);
      } else {
        setFormData({...InitialFormData});
        setStock([]);
      }
    }
  }, [showDialog]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setStockError(false);
    setPriceError(false);
    setCategoryError(false);

    //재고를 입력했는지 확인, 아니면 에러
    if (stock.length === 0) {
      return setStockError(true);
    }

    if (formData.price <= 0) {
      return setPriceError(true);
    }

    if (formData.category.length === 0) {
      return setCategoryError(true);
    }

    // 재고를 배열에서 객체로 바꿔주기
    // [['M',2]] 에서 {M:2}로
    const totalStock = stock.reduce((total, item) => {
      return {...total, [item[0]]: parseInt(item[1])};
    }, {});

    if (mode === 'new') {
      //새 상품 만들기
      dispatch(createProduct({...formData, stock: totalStock}));
    } else {
      // 상품 수정하기
      dispatch(updateProduct({id: selectedProduct._id, ...formData, stock: totalStock}));
    }
  };

  const handleChange = (event) => {
    const {id, value} = event.target;

    let newFormData = {
      ...formData,
      [id]: value
    };

    // saleRate나 price가 변경될 때 realPrice 계산
    if (id === 'saleRate' || id === 'price') {
      const price = Number(newFormData.price);
      const saleRate = Number(newFormData.saleRate) ? Number(newFormData.saleRate) : 0;

      newFormData.realPrice = price * (1 - saleRate / 100);
      newFormData.salePrice = price - newFormData.realPrice;
    }

    setFormData(newFormData);
  };

  const addStock = () => {
    //재고타입 추가시 배열에 새 배열 추가
    setStock([...stock, []]);
  };

  const deleteStock = (idx) => {
    //재고 삭제하기
    const newStock = stock.filter((item, index) => index !== idx);
    setStock(newStock);
  };

  const handleSizeChange = (value, index) => {
    //  재고 사이즈 변환하기
    const newStock = [...stock];
    newStock[index][0] = value;

    setStock(newStock);
  };

  const handleStockChange = (value, index) => {
    //재고 수량 변환하기
    const newStock = [...stock];
    newStock[index][1] = value;

    setStock(newStock);
  };

  const handleShowCategoryDialog = () => {
    setShowCategoryDialog(true);
  };

  const uploadImage = (url) => {
    //이미지 업로드
    setFormData({
      ...formData,
      image: url
    });
  };

  // 카테고리 추가시 폼에 추가
  useEffect(() => {
    if (category.length > 0) {
      setFormData({
        ...formData,
        category: category
      });
    }
  }, [showCategoryDialog]);

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {mode === 'new' ? <Modal.Title>상품 생성</Modal.Title> : <Modal.Title>상품 수정</Modal.Title>}
      </Modal.Header>
      {error && (
        <div className='error-message'>
          <Alert variant='danger'>{error.message}</Alert>
        </div>
      )}
      <Form className='form' onSubmit={handleSubmit}>
        <Row className='mb-0'>
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='sku'>
              <Form.Label>상품 ID</Form.Label>
              <Form.Control onChange={handleChange} type='string' placeholder='상품 ID' required value={formData.sku} />
            </Form.Group>

            <Form.Group as={Col} controlId='brand'>
              <Form.Label>브랜드 이름</Form.Label>
              <Form.Control
                type='string'
                placeholder='브랜드 이름'
                onChange={handleChange}
                value={formData.brand}
                required
              />
            </Form.Group>
          </Row>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>상품 이름</Form.Label>
            <Form.Control
              onChange={handleChange}
              type='string'
              placeholder='상품 이름'
              required
              value={formData.name}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>상품 설명</Form.Label>
            <Form.Control
              type='string'
              placeholder='상품 설명'
              as='textarea'
              onChange={handleChange}
              rows={3}
              value={formData.description}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='stock'>
            <Form.Label className='mr-1'>사이즈/재고</Form.Label>
            {stockError && <span className='error-message'>재고를 추가해주세요</span>}
            <Button size='sm' onClick={addStock}>
              추가 +
            </Button>
            <div className='mt-2'>
              {stock.map((item, index) => (
                <Row key={index}>
                  <Col sm={4}>
                    <Form.Control
                      type='text'
                      onChange={(event) => handleSizeChange(event.target.value, index)}
                      required
                      value={item[0] || ''}
                      placeholder='사이즈 입력'
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Control
                      onChange={(event) => handleStockChange(event.target.value, index)}
                      type='number'
                      placeholder='재고 수량'
                      value={item[1]}
                      required
                    />
                  </Col>
                  <Col sm={2}>
                    <Button variant='danger' size='sm' onClick={() => deleteStock(index)}>
                      -
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
          </Form.Group>
          <Form.Group className='mb-3' controlId='Image' required>
            <Form.Label>사진</Form.Label>
            <CloudinaryUploadWidget uploadImage={uploadImage} />

            <img
              id='uploadedimage'
              src={formData.image || ''}
              className='upload-image mt-2'
              alt='uploadedimage'
              style={{display: formData.image ? 'block' : 'none', width: '200px'}}></img>
          </Form.Group>
        </Row>
        <Row className='mb-0'>
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='price'>
              <Form.Label>정상가</Form.Label>
              <Form.Control value={formData.price} required onChange={handleChange} type='number' placeholder='0' />
            </Form.Group>

            <Form.Group as={Col} controlId='saleRate'>
              <Form.Label>할인율 (%)</Form.Label>
              <Form.Control
                value={formData.saleRate}
                onChange={handleChange}
                type='number'
                placeholder='0'
                min='0'
                max='100'
              />
            </Form.Group>

            <Form.Group as={Col} controlId='realPrice'>
              <Form.Label>판매가</Form.Label>
              <Form.Control
                value={formData.realPrice ? Math.round(formData.realPrice) : 0}
                type='number'
                placeholder='0'
                disabled
              />
            </Form.Group>
          </Row>
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='category'>
              <Form.Label>카테고리</Form.Label>
              <Button variant='primary' onClick={handleShowCategoryDialog} size='sm'>
                추가 +
              </Button>
              <Form.Control
                type='string'
                placeholder='카테고리를 추가해주세요...'
                rows={3}
                value={formData.category.map((cat) => getCategoryName(cat) + '(' + cat + ')').join(' > ')}
                required
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} controlId='status'>
              <Form.Label>상품 상태</Form.Label>
              <Form.Control
                value={formData.status ? formData.status : 'active'}
                required
                type='text'
                disabled
                placeholder='상품 상태'
              />
            </Form.Group>
          </Row>
          <Row className='mb-3'>
            {mode === 'new' ? (
              <Button variant='primary' type='submit' className='submit-btn'>
                생성
              </Button>
            ) : (
              <Button variant='primary' type='submit' className='submit-btn'>
                수정
              </Button>
            )}
          </Row>
        </Row>
      </Form>
      <CategoryDialog
        category={category}
        setCategory={setCategory}
        showCategoryDialog={showCategoryDialog}
        setShowCategoryDialog={setShowCategoryDialog}
      />
    </Modal>
  );
};

export default NewItemDialog;
