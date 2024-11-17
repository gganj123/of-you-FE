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

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
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
  }
});

export const {clearProducts} = productSlice.actions;

export default productSlice.reducer;
