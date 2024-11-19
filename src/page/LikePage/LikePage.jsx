import {useEffect, useState} from 'react';
import ProductCard from '../../common/components/ProductCard/ProductCard';
import './LikePage.style.css';

const LikePage = () => {
  const [likedProducts] = useState([
    {
      id: 1,
      image: '/images/banner4.jpg',
      brand: 'LE',
      title: '[30%쿠폰] hood duck-down padding_2color',
      salePrice: 148260,
      originalPrice: 397000,
      discountRate: 62
    },
    {
      id: 2,
      brand: 'demeriel',
      title: 'Veneta Hobo Bag Medium Chestnut',
      image: '/images/banner2.jpg',
      salePrice: 200208,
      originalPrice: 258000,
      discountRate: 22
    },
    {
      id: 3,
      brand: 'demeriel',
      title: 'Veneta Hobo Bag Medium Chestnut',
      image: '/images/banner5.jpg',
      salePrice: 200208,
      originalPrice: 258000,
      discountRate: 22,
      tags: ['예약', '쿠폰']
    },
    {
      id: 4,
      brand: 'demeriel',
      title: 'Veneta Hobo Bag Medium Chestnut',
      image: '/images/banner7.jpg',
      salePrice: 200208,
      originalPrice: 258000,
      discountRate: 22
    },
    {
      id: 5,
      brand: 'demeriel',
      title: 'Veneta Hobo Bag Medium Chestnut',
      image: '/images/banner8.jpg',
      salePrice: 200208,
      originalPrice: 258000,
      discountRate: 22
    }
  ]);

  const [activeTab, setActiveTab] = useState('All');
  const [viewType, setViewType] = useState('grid');

  return (
    <div className='like-page'>
      <div className='like-page-header'>
        <h1 className='like-page-title'>MY♡ITEM ({likedProducts.length})</h1>
        <div className='like-page-tabs'>
          <div className={`tab-button ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>
            All
          </div>
          <div className={`tab-button ${activeTab === 'WOMEN' ? 'active' : ''}`} onClick={() => setActiveTab('WOMEN')}>
            WOMEN
          </div>
          <div className={`tab-button ${activeTab === 'MEN' ? 'active' : ''}`} onClick={() => setActiveTab('MEN')}>
            MEN
          </div>
          <div className={`tab-button ${activeTab === 'LIFE' ? 'active' : ''}`} onClick={() => setActiveTab('LIFE')}>
            LIFE
          </div>
          <div
            className={`tab-button ${activeTab === 'BEAUTY' ? 'active' : ''}`}
            onClick={() => setActiveTab('BEAUTY')}>
            BEAUTY
          </div>
        </div>
      </div>

      <div className={`products-container ${viewType}`}>
        {likedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            brand={product.brand}
            title={product.title}
            salePrice={product.salePrice}
            originalPrice={product.originalPrice}
            discountRate={product.discountRate}
          />
        ))}
      </div>
    </div>
  );
};

export default LikePage;
