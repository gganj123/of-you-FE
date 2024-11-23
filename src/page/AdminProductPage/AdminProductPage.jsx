import React, {useState, useEffect} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ReactPaginate from 'react-paginate';
import NewItemDialog from './component/NewItemDialog';
import './AdminProductPage.style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getProductList, deleteProduct, setSelectedProduct} from '../../features/product/productSlice';
import {FiSearch} from 'react-icons/fi';

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

  const tableHeader = {
    '#': 'td-index',
    Sku: 'td-sku',
    상품이름: 'td-name',
    기존금액: 'td-price',
    할인금액: 'td-real-price',
    '사이즈 종류': 'td-stock',
    사진: 'td-image',
    '': 'td-btn'
  };

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

  const onCheckEnter = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery({...searchQuery, page: 1, name: event.target.value});
    }
  };

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    if (showDialog) return;
    dispatch(getProductList({...searchQuery}));
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

  // 페이지네이션 반응형 조절
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);
  const [nextLabel, setNextLabel] = useState('next >');
  const [previousLabel, setPreviousLabel] = useState('< previous');
  const [breakLabel, setBreakLabel] = useState('...');
  const [marginPagesDisplayed, setMarginPagesDisplayed] = useState(2); // 추가

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setPageRangeDisplayed(3);
        setNextLabel('>');
        setPreviousLabel('<');
        setBreakLabel('');
        setMarginPagesDisplayed(1);
      } else {
        setPageRangeDisplayed(5);
        setNextLabel('next >');
        setPreviousLabel('< previous');
        setBreakLabel('...');
        setMarginPagesDisplayed(3);
      }
    };

    handleResize(); // 초기 실행
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='admin-product-page admin-product-section'>
      <div className='product-content'>
        <div className='admin-order-header'>
          <h1>제품 관리</h1>
          <div className='admin-search-bar-container'>
            <div className='admin-search-bar'>
              <input
                type='text'
                id='search-query'
                placeholder='제품 이름으로 검색'
                value={keyword}
                onKeyDown={onCheckEnter}
                onChange={(e) => setKeyword(e.target.value)}
                autoComplete='off'
              />
              <FiSearch onClick={handleSearchSubmit} />
            </div>

            <select id='items-per-page' value={searchQuery.limit} onChange={handleLimitChange}>
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='30'>30</option>
            </select>
          </div>
          <div className='admin-add-new-item-btn-container'>
            <div className='count-text'>{totalCount} 개의 상품이 있습니다.</div>
            <button className='add-new-item-btn' onClick={handleClickNewItem}>
              Add New Item +
            </button>
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
                {Object.keys(tableHeader).map((header, index) => (
                  <th key={index} className={tableHeader[header]}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td className='td-index'>{index + 1}</td>
                  <td className='td-sku'>{product.sku}</td>
                  <td className='td-name'>{product.name}</td>
                  <td className='td-price'>{product.price.toLocaleString()}</td>
                  <td className='td-real-price'>{product.realPrice.toLocaleString()}</td>
                  <td className='td-stock'>
                    {Object.keys(product.stock).map((size, index) => (
                      <div key={index}>
                        {size}:{product.stock[size]}
                      </div>
                    ))}
                  </td>
                  <td className='td-image'>
                    <img src={product.image} alt={product.name} />
                  </td>
                  <td className='td-btn'>
                    <button className='add-new-item-btn edit-btn' onClick={() => openEditForm(product)}>
                      Edit
                    </button>
                    <button className='add-new-item-btn delete-btn' onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <ReactPaginate
          nextLabel={nextLabel}
          onPageChange={handlePageClick}
          pageRangeDisplayed={pageRangeDisplayed}
          marginPagesDisplayed={marginPagesDisplayed}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1}
          previousLabel={previousLabel}
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
