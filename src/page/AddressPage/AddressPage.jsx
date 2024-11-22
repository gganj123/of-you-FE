import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAddressList, addAddress, updateAddress, deleteAddress} from '../../features/address/addressSlice';
import DaumPostcode from 'react-daum-postcode';
import './AddressPage.style.css';

const AddressPage = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.addresses);
  const loading = useSelector((state) => state.address.loading);
  const error = useSelector((state) => state.address.error);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const initialFormData = {
    id: '',
    shipto: {
      zipCode: '',
      address: '',
      city: ''
    },
    contact: {
      firstName: '',
      lastName: '',
      prefix: '',
      middle: '',
      last: ''
    },
    isDefault: false
  };

  const [formData, setFormData] = useState(initialFormData);

  // 주소 목록 가져오기
  useEffect(() => {
    dispatch(getAddressList());
  }, [dispatch]);

  const resetAllStates = () => {
    setFormData(initialFormData);
    setSelectedAddress(null);
    setIsAddressModalOpen(false);
    setIsPostcodeOpen(false);
  };

  const handlePostcodeComplete = (data) => {
    setFormData((prev) => ({
      ...prev,
      zipCode: data.zonecode,
      address: data.address,
      city: data.city
    }));
    setIsPostcodeOpen(false);
  };

  const handleEditClick = (address) => {
    resetAllStates();
    setSelectedAddress(address);
    setFormData({
      id: address._id,
      shipto: {
        zipCode: address.shipto.zip,
        address: address.shipto.address,
        city: address.shipto.city
      },
      contact: {
        firstName: address.contact.firstName,
        lastName: address.contact.lastName,
        prefix: address.contact.prefix,
        middle: address.contact.middle,
        last: address.contact.last
      },
      isDefault: address.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleAddClick = () => {
    resetAllStates();
    setIsAddressModalOpen(true);
  };

  const handleCloseModal = () => {
    resetAllStates();
  };

  const handleContactChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('해당 배송지를 삭제하시겠습니까?')) {
      dispatch(deleteAddress(addressId));
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();

    // 필수 항목 확인
    if (!formData.contact.firstName || !formData.contact.lastName) {
      alert('성명은 필수 입력 사항입니다.');
      return;
    }

    if (!formData.contact.prefix || !formData.contact.middle || !formData.contact.last) {
      alert('연락처는 필수 입력 사항입니다.');
      return;
    }

    if (!formData.address || !formData.city || !formData.zipCode) {
      alert('주소는 필수 입력 사항입니다.');
      return;
    }

    const addressData = {
      id: formData.id,
      shipto: {
        zip: formData.zipCode,
        address: formData.address,
        city: formData.city
      },
      contact: {
        firstName: formData.contact.firstName,
        lastName: formData.contact.lastName,
        prefix: formData.contact.prefix,
        middle: formData.contact.middle,
        last: formData.contact.last,
        contact: formData.contact.contact
      },
      isDefault: formData.isDefault
    };

    if (formData.id) {
      dispatch(updateAddress({addressId: formData.id, updatedData: addressData}));
    } else {
      dispatch(addAddress(addressData));
    }

    resetAllStates();
  };

  useEffect(() => {
    console.log('Updated formData:', formData);
  }, [formData]);

  return (
    <div className='address-page-container'>
      <h2 className='address-page-title'>배송지 관리</h2>

      {/* 배송지 목록 */}
      {loading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}

      {addresses.map((address) => (
        <div key={address._id} className='address-page-item'>
          <div className='address-page-item-info'>
            <div className='address-page-item-header'>
              <span className='address-page-item-name'>
                {address.contact.lastName}
                {address.contact.firstName}
              </span>
              {address.isDefault && <span className='address-page-item-badge'>기본배송지</span>}
            </div>
            <p className='address-page-item-address'>
              ({address.shipto.zip}) {address.shipto.address} {address.shipto.city}
            </p>
            <p className='address-page-item-phone'>
              {address.contact.prefix}-{address.contact.middle}-{address.contact.last}
            </p>
          </div>
          <div className='address-page-item-actions'>
            <button className='address-page-edit-btn' onClick={() => handleEditClick(address)}>
              수정
            </button>
            <button className='address-page-delete-btn' onClick={() => handleDeleteAddress(address._id)}>
              삭제
            </button>
          </div>
        </div>
      ))}

      {/* 새 배송지 추가 버튼 */}
      <div className='address-page-add-wrapper'>
        <button className='address-page-add-btn' onClick={handleAddClick}>
          배송지 등록
        </button>
      </div>

      {/* 배송지 등록/수정 모달 */}
      {isAddressModalOpen && (
        <div className='address-page-modal-overlay'>
          <div className='address-page-modal'>
            <div className='address-page-modal-header'>
              <h3 className='address-page-modal-title'>{selectedAddress ? '배송지 수정' : '배송지 등록'}</h3>
              <button className='address-page-modal-close' onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className='address-page-form'>
              {/* 성명 입력 */}
              <div className='address-page-form-row'>
                <label className='address-page-form-label'>
                  받으시는 분<span className='address-page-required'>*</span>
                </label>
                <div className='address-page-name-group'>
                  <input
                    type='text'
                    className='address-page-input name-input'
                    value={formData.contact.lastName}
                    onChange={(e) =>
                      setFormData({...formData, contact: {...formData.contact, lastName: e.target.value}})
                    }
                    placeholder='성'
                  />
                  <input
                    type='text'
                    className='address-page-input name-input'
                    value={formData.contact.firstName}
                    onChange={(e) =>
                      setFormData({...formData, contact: {...formData.contact, firstName: e.target.value}})
                    }
                    placeholder='이름'
                  />
                </div>
              </div>

              {/* 연락처 입력 */}
              <div className='address-page-form-row'>
                <label className='address-page-form-label'>
                  연락처<span className='address-page-required'>*</span>
                </label>
                <div className='address-page-phone-group'>
                  <select
                    className='address-page-select'
                    name='prefix'
                    value={formData.contact.prefix}
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
                    className='address-page-input phone-input'
                    name='middle'
                    value={formData.contact.middle}
                    onChange={handleContactChange}
                    maxLength={4}
                  />
                  <input
                    type='text'
                    className='address-page-input phone-input'
                    name='last'
                    value={formData.contact.last}
                    onChange={handleContactChange}
                    maxLength={4}
                  />
                </div>
              </div>

              {/* 주소 입력 */}
              <div className='address-page-form-row'>
                <label className='address-page-form-label'>
                  주소<span className='address-page-required'>*</span>
                </label>
                <div className='address-page-address-wrapper'>
                  <div className='address-page-postcode-row'>
                    <input
                      type='text'
                      className='address-page-input address-page-postcode'
                      value={formData.zipCode}
                      placeholder='우편번호'
                      readOnly
                    />
                    <button type='button' className='address-page-postcode-btn' onClick={() => setIsPostcodeOpen(true)}>
                      우편번호 찾기
                    </button>
                  </div>
                  <input
                    type='text'
                    className='address-page-input'
                    value={formData.address}
                    placeholder='도로명 주소'
                    readOnly
                  />
                  <input
                    type='text'
                    className='address-page-input'
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder='상세 주소'
                  />
                </div>
              </div>

              {/* 기본 배송지 설정 */}
              <div className='address-page-form-row'>
                <label className='address-page-checkbox'>
                  <input
                    type='checkbox'
                    className='address-checkbox-input'
                    checked={formData.isDefault}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        isDefault: e.target.checked
                      }));
                    }}
                  />
                  <span className='address-checkbox-text'>기본 배송지로 설정</span>
                </label>
              </div>

              {/* 버튼 영역 */}
              <div className='address-page-modal-actions'>
                <button type='button' className='address-page-cancel-btn' onClick={handleCloseModal}>
                  취소
                </button>
                <button type='submit' className='address-page-submit-btn'>
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 우편번호 검색 모달 */}
      {isPostcodeOpen && (
        <div className='address-page-modal-overlay'>
          <div className='address-page-postcode-modal'>
            <div className='address-page-modal-header'>
              <h3 className='address-page-modal-title'>우편번호 찾기</h3>
              <button className='address-pag-modal-close' onClick={() => setIsPostcodeOpen(false)}>
                ✕
              </button>
            </div>
            {/* Daum 우편번호 검색기 */}
            <DaumPostcode onComplete={handlePostcodeComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
