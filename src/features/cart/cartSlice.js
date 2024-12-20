import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  loading: false,
  error: '',
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0
};

export const addToCart = createAsyncThunk('cart/addToCart', async ({cartItems}, {rejectWithValue, dispatch}) => {
  try {
    const response = await api.post('/cart', {cartItems});
    dispatch(getCartQty());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart.');
  }
});

export const getCartList = createAsyncThunk('cart/getCartList', async (_, {rejectWithValue, dispatch}) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id, {rejectWithValue, dispatch}) => {
  try {
    const response = await api.delete(`/cart/${id}`);
    dispatch(getCartQty());
    dispatch(getCartList());
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

export const updateQty = createAsyncThunk('cart/updateQty', async ({cartItemId, size, qty}, {rejectWithValue}) => {
  try {
    const response = await api.put('/cart', {cartItemId, size, qty});
    return response.data;
  } catch (error) {
    console.error('UpdateQty API Error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || '옵션/수량 수정에 실패하였습니다.');
  }
});

export const getCartQty = createAsyncThunk('cart/getCartQty', async (_, {rejectWithValue, dispatch}) => {
  try {
    const response = await api.get('cart/count');
    return response.data.count;
  } catch (error) {
    return rejectWithValue(error.error);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.cartItemCount = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getCartList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCartList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';

      const cartData = action.payload.data || [];

      state.cartList = cartData.map((item) => ({
        ...item,
        cartItemId: item.cartItemId || `${item.productId}_${item.size}`
      }));

      state.totalPrice = state.cartList.reduce((total, item) => total + item.productId.price * item.qty, 0);
    });

    builder.addCase(getCartList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      // state.cartItemCount = 0;
    });
    builder.addCase(deleteCartItem.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
    });
    builder.addCase(deleteCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateQty.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateQty.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      const updatedItem = action.payload;
    });
    builder.addCase(updateQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getCartQty.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCartQty.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.cartItemCount = action.payload;
    });
    builder.addCase(getCartQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export default cartSlice.reducer;
export const {initialCart} = cartSlice.actions;
