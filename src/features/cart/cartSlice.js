import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

// 장바구니 데이터 가져오기
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get('/cart');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});
export const addToCartAsync = createAsyncThunk('cart/addToCart', async (cartItem, {rejectWithValue}) => {
  try {
    const response = await api.post('/cart', {items: [cartItem]});
    return response.data; // 서버 응답 데이터 반환
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // 장바구니 항목
    loading: false,
    error: null
  },
  reducers: {
    // 로컬 장바구니 데이터 초기화
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((cartItem) => ({
          id: cartItem._id,
          productId: cartItem.productId._id,
          name: cartItem.productId.name,
          brand: cartItem.productId.brand,
          image: cartItem.productId.image,
          price: cartItem.productId.price,
          size: cartItem.size,
          qty: cartItem.qty,
          saleRate: cartItem.productId.saleRate,
          stock: cartItem.productId.stock
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {clearCart} = cartSlice.actions;

export default cartSlice.reducer;
