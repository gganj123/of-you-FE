import React, {useState, useEffect} from 'react';
import {Form, Modal, Button, Row, Col, Alert} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import './NewItemDialog.style.css';
import './AdminCategoryDialog.style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import {getCategoryName, getSubcategoryName, categories} from '../../../utils/categories';

const CategoryDialog = ({category, setCategory, showCategoryDialog, setShowCategoryDialog}) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleClose = () => {
    //모든걸 초기화시키고;
    // 다이얼로그 닫아주기
    setCategory([]);
    setSelectedCategory('');
    setShowCategoryDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setShowCategoryDialog(false);
  };

  const handleSubCategoryClick = (subcategory) => {
    console.log(selectedCategory, subcategory);
    setCategory([selectedCategory, subcategory]);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Modal show={showCategoryDialog} onHide={handleClose}>
      <Modal.Header closeButton>{showCategoryDialog ? <Modal.Title>카테고리 관리</Modal.Title> : ''}</Modal.Header>
      <Form className='form' onSubmit={handleSubmit} style={{display: 'block'}}>
        <Row className='mb-3'>
          <Form.Group as={Col} controlId='category'>
            <Form.Label></Form.Label>
            <div className='admin-category-menu'>
              <div className='navbar-category-list'>
                {Object.keys(categories).map((category) => (
                  <div key={category} className='navbar-category-item' onClick={() => handleCategoryClick(category)}>
                    {getCategoryName(category)} ({category}){' '}
                    {selectedCategory === category && <span className='navbar-arrow'>▶</span>}
                  </div>
                ))}
              </div>
              {selectedCategory && (
                <div className='navbar-subcategory-list'>
                  {categories[selectedCategory].map((subcategory) => (
                    <div
                      key={subcategory}
                      className='navbar-subcategory-item'
                      onClick={() => handleSubCategoryClick(subcategory)}>
                      {getSubcategoryName(subcategory)} ({subcategory})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='selected-categories mt-3'>
              <Form.Label>선택된 카테고리</Form.Label>
              {category.length > 0 && (
                <div className='d-flex gap-2 flex-wrap'>
                  {category.map((cat, index) => (
                    <span key={index} className='badge bg-primary'>
                      {getCategoryName(cat)} ({cat})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Form.Group>
        </Row>
        <Row className='mb-3'>
          <Button variant='primary' type='submit' className='submit-btn'>
            추가
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

CategoryDialog.propTypes = {
  category: PropTypes.array.isRequired,
  setCategory: PropTypes.func.isRequired,
  showCategoryDialog: PropTypes.bool.isRequired,
  setShowCategoryDialog: PropTypes.func.isRequired
};

export default CategoryDialog;
