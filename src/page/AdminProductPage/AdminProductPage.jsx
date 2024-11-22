import React, {useState, useEffect} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ReactPaginate from 'react-paginate';
import NewItemDialog from './component/NewItemDialog';
import './AdminProductPage.style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {fetchProducts, deleteProduct, setSelectedProduct} from '../../features/product/productSlice';

const AdminProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const {products, totalPageNum, totalCount, loading} = useSelector((state) => state.products);

  const [keyword, setKeyword] = useState(query.get('name') || '');
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState('new');

  const [searchQuery, setSearchQuery] = useState({
    page: query.get('page') || 1,
    name: query.get('name') || '',
    limit: query.get('limit') || 5
  });

  const tableHeader = ['#', 'Sku', '상품이름', '기존금액', '할인금액', '사이즈 종류', '사진', ''];

  const handlePageClick = ({selected}) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({...searchQuery, page: selected + 1});
  };

  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if (searchQuery.name === '') {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate(`?${query}`);
  }, [searchQuery]);

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    if (showDialog) return;
    dispatch(fetchProducts({...searchQuery}));
  }, [query, showDialog]);

  const handleClickNewItem = () => {
    setMode('new');
    setShowDialog(true);
  };

  const handleSearchSubmit = () => {
    setSearchQuery({...searchQuery, name: keyword, page: 1});
  };

  const handleLimitChange = (event) => {
    setSearchQuery({
      ...searchQuery,
      page: 1,
      limit: event.target.value
    });
  };

  const openEditForm = (product) => {
    //edit모드로 설정하고
    // 아이템 수정다이얼로그 열어주기
    setMode('edit');
    setShowDialog(true);
    dispatch(setSelectedProduct(product));
  };
  const handleDelete = (id) => {
    const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
    if (!isConfirmed) {
      return;
    }
    try {
      dispatch(deleteProduct(id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('상품 삭제에 실패했습니다.');
    }

    alert('상품이 삭제되었습니다.');
  };

  return (
    <div className='admin-product-page admin-product-section'>
      <div className='product-content'>
        <div className='admin-order-header'>
          <h1>제품 관리</h1>
          <div>
            <div className='search-box'>
              <input type='text' id='search-query' placeholder='제품 이름으로 검색' className='search-input' />
              <button className='add-new-item-btn' onClick={handleClickNewItem}>
                Add New Item +
              </button>
              <select id='items-per-page' value={searchQuery.limit} onChange={handleLimitChange}>
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='20'>20</option>
                <option value='30'>30</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className='text-center my-5'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        ) : (
          <table className='product-table'>
            <thead>
              <tr>
                {tableHeader.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString()}</td>
                  <td>{product.salePrice.toLocaleString()}</td>
                  <td>
                    {Object.keys(product.stock).map((size, index) => (
                      <div key={index}>
                        {size}:{product.stock[size]}
                      </div>
                    ))}
                  </td>
                  <td>
                    <img src={product.image} alt={product.name} />
                  </td>
                  <td>
                    <button onClick={() => openEditForm(product)}>Edit</button>
                    <button onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <ReactPaginate
          nextLabel='next >'
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1}
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
      <NewItemDialog mode={mode} showDialog={showDialog} setShowDialog={setShowDialog} />
    </div>
  );
};

export default AdminProductPage;
