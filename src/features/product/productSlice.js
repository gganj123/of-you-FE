import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

// 상품 목록 가져오기 비동기 Thunk
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, {rejectWithValue}) => {
  try {
    // mainCate와 subCate 추출
    const {mainCate, subCate, ...queryParams} = params;

    if (!mainCate) {
      throw new Error('mainCate is required but not provided.');
    }
    // 동적으로 엔드포인트 생성
    let endpoint = `/product/category/${mainCate}`;
    if (subCate) {
      endpoint += `/${subCate}`;
    }

    console.log('Fetching products from endpoint:', endpoint, 'with params:', queryParams);

    // API 호출
    const response = await api.get(endpoint, {params: queryParams});
    console.log('상품목록:', params);

    return response.data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const searchProduct = createAsyncThunk('/product/searchProduct', async (params, {rejectWithValue}) => {
  try {
    const {limit, name, page, sort} = params;

    const response = await api.get('/product', {params: {limit, name, page, sort}});
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchProductDetail = createAsyncThunk(`product/fetchProductDetail`, async (id, {rejectWithValue}) => {
  try {
    const response = await api.get(`/product/${id}`);

    return response.data.product;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProduct = createAsyncThunk(`product/updateProduct`, async (product, {rejectWithValue, dispatch}) => {
  try {
    const response = await api.put(`/product/${product.id}`, product);

    dispatch(getProductList({page: 1, limit: 5}));
    return response.data.product;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteProduct = createAsyncThunk(`product/deleteProduct`, async (id, {rejectWithValue, dispatch}) => {
  try {
    const response = await api.delete(`/product/${id}`);
    dispatch(getProductList({page: 1, limit: 5}));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.post('/product', formData);

      dispatch(getProductList({page: 1, limit: 5}));
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getProductList = createAsyncThunk('products/getProductList', async (query, {rejectWithValue}) => {
  try {
    const response = await api.get('/product', {params: {...query}});

    return response.data;
  } catch (err) {
    return rejectWithValue(err.error);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    productDetail: null,
    loading: false,
    error: null,
    totalPageNum: 1,
    totalCount: 0,
    currentPage: 1,
    hasMoreProducts: true
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
    },
    clearProductDetail: (state) => {
      state.productDetail = null; // 상세 정보 초기화
    },
    clearError: (state) => {
      state.error = '';
      state.success = false;
    },
    addMoreProducts: (state, action) => {
      const newProducts = Array.isArray(action.payload?.products) ? action.payload.products : [];
      state.products = [...state.products, ...newProducts];
      state.currentPage += 1;
      state.hasMoreProducts = action.payload.products.length > 0;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPageNum = action.payload.totalPageNum;
        state.totalCount = action.payload.totalCount;
        state.currentPage = 1;
        state.hasMoreProducts = action.payload.products.length > 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(searchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPageNum = action.payload.totalPageNum;
        state.totalCount = action.payload.totalCount;
        state.currentPage = 1;
        state.hasMoreProducts = action.payload.products.length > 0;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetail = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
        console.log(Object.entries(state.productDetail.stock));
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Something went wrong.';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Something went wrong.';
      })
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPageNum = action.payload.totalPageNum;
        state.totalCount = action.payload.totalCount;
        state.error = '';
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Something went wrong.';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = '';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Something went wrong.';
        state.success = false;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = '';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Something went wrong.';
        state.success = false;
      });
  }
});

export const {clearProducts, clearProductDetail, clearError, setSelectedProduct} = productSlice.actions;

export default productSlice.reducer;
