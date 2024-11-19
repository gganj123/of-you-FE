import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

// 상품 목록 가져오기 비동기 Thunk
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, {rejectWithValue}) => {
  try {
    const response = await api.get('/product', {params});
    return response.data.products; // API에서 받은 상품 데이터
  } catch (error) {
    return rejectWithValue(error);
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

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    productDetail: null,
    loading: false,
    error: null
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
    },
    clearProductDetail: (state) => {
      state.productDetail = null; // 상세 정보 초기화
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
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
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
      });
  }
});

export const {clearProducts, clearProductDetail} = productSlice.actions;

export default productSlice.reducer;