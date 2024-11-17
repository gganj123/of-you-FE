import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './AdminProductPage.style.css';

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageNum, setTotalPageNum] = useState(10);

  const tableHeader = ['#', 'Sku', 'Name', 'Price', 'Stock', 'Image', 'Status', ''];

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    console.log('AdminProductPage');
  }, []);

  const testProducts = [
    {
      id: 1,
      sku: 'SKU123',
      name: 'Product 1',
      price: '10.00',
      stock: 100,
      image: 'https://via.placeholder.com/50',
      status: 'Active'
    },
    {
      id: 2,
      sku: 'SKU124',
      name: 'Product 2',
      price: '20.00',
      stock: 200,
      image: 'https://via.placeholder.com/50',
      status: 'Inactive'
    },
    {
      id: 3,
      sku: 'SKU125',
      name: 'Product 3',
      price: '30.00',
      stock: 300,
      image: 'https://via.placeholder.com/50',
      status: 'Active'
    },
    {
      id: 4,
      sku: 'SKU126',
      name: 'Product 4',
      price: '40.00',
      stock: 400,
      image: 'https://via.placeholder.com/50',
      status: 'Inactive'
    },
    {
      id: 5,
      sku: 'SKU127',
      name: 'Product 5',
      price: '50.00',
      stock: 500,
      image: 'https://via.placeholder.com/50',
      status: 'Active'
    }
  ];

  return (
    <div className='admin-product-page'>
      <div className='product-content'>
        <div className='product-header'>
          <div className='search-box'>
            <input type='text' id='search-query' placeholder='제품 이름으로 검색' className='search-input' />
          </div>
          <div className='header-actions'>
            <button className='add-new-item-btn' onClick={() => alert('Add New Item')}>
              Add New Item +
            </button>
            <div className='item-count-dropdown'>
              <select id='items-per-page' onChange={(e) => alert(`Items per page: ${e.target.value}`)}>
                <option value='10'>10</option>
                <option value='20'>20</option>
                <option value='30'>30</option>
                <option value='50'>50</option>
              </select>
            </div>
          </div>
        </div>

        <table className='product-table'>
          <thead>
            <tr>
              {tableHeader.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {testProducts.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <img src={product.image} alt={product.name} />
                </td>
                <td>{product.status}</td>
                <td>
                  <button onClick={() => alert('Edit')}>Edit</button>
                  <button onClick={() => alert('Delete')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ReactPaginate
          nextLabel='next >'
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={currentPage - 1}
          previousLabel='< previous'
          renderOnZeroPageCount={null}
          pageClassName='page-item'
          pageLinkClassName='page-link'
          previousClassName='page-item'
          previousLinkClassName='page-link'
          nextClassName='page-item'
          nextLinkClassName='page-link'
          breakLabel='...'
          breakClassName='page-item'
          breakLinkClassName='page-link'
          containerClassName='pagination'
          activeClassName='active'
          className='display-center list-style-none'
        />
      </div>
    </div>
  );
};

export default AdminProductPage;
