// AddressPage.jsx
import React, { useState } from "react";
import DaumPostcode from 'react-daum-postcode';
import "./AddressPage.style.css";

const AddressPage = () => {
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // 초기 formData 상태
  const initialFormData = {
    id: null,
    firstName: '',
    lastName: '',
    zipCode: '',
    address: '',
    detailAddress: '',
    contact: {
      prefix: '',
      middle: '',
      last: ''
    },
    isDefault: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [addresses, setAddresses] = useState(() => {
    const savedAddresses = localStorage.getItem('addresses');
    return savedAddresses ? JSON.parse(savedAddresses) : [];
  });

  const resetAllStates = () => {
    setFormData(initialFormData);
    setSelectedAddress(null);
    setIsAddressModalOpen(false);
    setIsPostcodeOpen(false);
  };

  const handlePostcodeComplete = (data) => {
    setFormData(prev => ({
      ...prev,
      zipCode: data.zonecode,
      address: data.address
    }));
    setIsPostcodeOpen(false);
  };

  const handleEditClick = (address) => {
    resetAllStates();
    setSelectedAddress(address);
    setFormData({
      id: address.id,
      firstName: address.firstName,
      lastName: address.lastName,
      zipCode: address.zipCode,
      address: address.address,
      detailAddress: address.detailAddress,
      contact: {
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('해당 배송지를 삭제하시겠습니까?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.zipCode ||
      !formData.address ||
      !formData.contact.prefix ||
      !formData.contact.middle ||
      !formData.contact.last
    ) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    const updatedAddresses = [...addresses];

    // 기본 배송지 처리
    if (formData.isDefault) {
      updatedAddresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    const addressData = {
      ...formData,
      id: formData.id || Date.now()
    };

    if (formData.id) {
      // 수정
      const index = updatedAddresses.findIndex(addr => addr.id === formData.id);
      if (index !== -1) {
        updatedAddresses[index] = addressData;
      }
    } else {
      // 새로 추가
      updatedAddresses.push(addressData);
    }

    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    resetAllStates();
  };

  return (
    <div className="address-page-container">
      <h2 className="address-page-title">배송지 관리</h2>

      {/* 배송지 목록 */}
      {addresses.map((address) => (
        <div key={address.id} className="address-page-item">
          <div className="address-page-item-info">
            <div className="address-page-item-header">
              <span className="address-page-item-name">
                {address.lastName}{address.firstName}
              </span>
              {address.isDefault && (
                <span className="address-page-item-badge">기본배송지</span>
              )}
            </div>
            <p className="address-page-item-address">
              [{address.zipCode}] {address.address} {address.detailAddress}
            </p>
            <p className="address-page-item-phone">
              {address.contact.prefix}-{address.contact.middle}-{address.contact.last}
            </p>
          </div>
          <div className="address-page-item-actions">
            <button
              className="address-page-edit-btn"
              onClick={() => handleEditClick(address)}
            >
              수정
            </button>
            <button
              className="address-page-delete-btn"
              onClick={() => handleDeleteAddress(address.id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}

      {/* 새 배송지 추가 버튼 */}
      <div className="address-page-add-wrapper">
        <button
          className="address-page-add-btn"
          onClick={handleAddClick}
        >
          배송지 등록
        </button>
      </div>

      {/* 배송지 등록/수정 모달 */}
      {isAddressModalOpen && (
        <div className="address-page-modal-overlay">
          <div className="address-page-modal">
            <div className="address-page-modal-header">
              <h3 className="address-page-modal-title">
                {selectedAddress ? '배송지 수정' : '배송지 등록'}
              </h3>
              <button
                className="address-page-modal-close"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="address-page-form">
              {/* 성명 입력 */}
              <div className="address-page-form-row">
                <label className="address-page-form-label">
                  받으시는 분<span className="address-page-required">*</span>
                </label>
                <div className="address-page-name-group">
                  <input
                    type="text"
                    className="address-page-input name-input"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="성"
                  />
                  <input
                    type="text"
                    className="address-page-input name-input"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="이름"
                  />
                </div>
              </div>

              {/* 연락처 입력 */}
              <div className="address-page-form-row">
                <label className="address-page-form-label">
                  연락처<span className="address-page-required">*</span>
                </label>
                <div className="address-page-phone-group">
                  <select
                    className="address-page-select"
                    name="prefix"
                    value={formData.contact.prefix}
                    onChange={handleContactChange}
                  >
                    <option value="" disabled>선택</option>
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="017">017</option>
                    <option value="018">018</option>
                    <option value="019">019</option>
                  </select>
                  <input
                    type="text"
                    className="address-page-input phone-input"
                    name="middle"
                    value={formData.contact.middle}
                    onChange={handleContactChange}
                    maxLength={4}
                  />
                  <input
                    type="text"
                    className="address-page-input phone-input"
                    name="last"
                    value={formData.contact.last}
                    onChange={handleContactChange}
                    maxLength={4}
                  />
                </div>
              </div>

              {/* 주소 입력 */}
              <div className="address-page-form-row">
                <label className="address-page-form-label">
                  주소<span className="address-page-required">*</span>
                </label>
                <div className="address-page-address-wrapper">
                  <div className="address-page-postcode-row">
                    <input
                      type="text"
                      className="address-page-input address-page-postcode"
                      value={formData.zipCode}
                      placeholder="우편번호"
                      readOnly
                    />
                    <button
                      type="button"
                      className="address-page-postcode-btn"
                      onClick={() => setIsPostcodeOpen(true)}
                    >
                      우편번호 찾기
                    </button>
                  </div>
                  <input
                    type="text"
                    className="address-page-input"
                    value={formData.address}
                    placeholder="도로명 주소"
                    readOnly
                  />
                  <input
                    type="text"
                    className="address-page-input"
                    value={formData.detailAddress}
                    onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                    placeholder="상세 주소"
                  />
                </div>
              </div>

              {/* 기본 배송지 설정 */}
              <div className="address-page-form-row">
                <label className="address-page-checkbox">
                  <input
                    type="checkbox"
                    className="address-checkbox-input"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                  <span className="address-checkbox-text">기본 배송지로 설정</span>
                </label>
              </div>

              {/* 버튼 영역 */}
              <div className="address-page-modal-actions">
                <button
                  type="button"
                  className="address-page-cancel-btn"
                  onClick={handleCloseModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="address-page-submit-btn"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 우편번호 검색 모달 */}
      {isPostcodeOpen && (
        <div className="address-page-modal-overlay">
          <div className="address-page-postcode-modal">
            <div className="address-page-modal-header">
              <h3 className="address-page-modal-title">우편번호 찾기</h3>
              <button
                className="address-page-modal-close"
                onClick={() => setIsPostcodeOpen(false)}
              >
                ✕
              </button>
            </div>
            <DaumPostcode onComplete={handlePostcodeComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;