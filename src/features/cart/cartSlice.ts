import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import api from '../../utils/api';

interface CartItem {
  id: string;
  productId: {
    id: string;
    price: number;
    name: string;
  };
  qty: number;
  size?: string;
  cartItemId?: string;
}

interface CartState {
  loading: boolean;
  error: string | null;
  cartList: CartItem[];
  selectedItem: CartItem | null;
  cartItemCount: number;
  totalPrice: number;
}

const initialState: CartState = {
  loading: false,
  error: null,
  cartList: [],
  selectedItem: null,
  cartItemCount: 0,
  totalPrice: 0
};

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({cartItems}: {cartItems: CartItem[]}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.post('/cart', {cartItems});
      dispatch(getCartQty());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart.');
    }
  }
);

export const getCartList = createAsyncThunk('cart/getCartList', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart list');
  }
});

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (id: string, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      dispatch(getCartQty());
      dispatch(getCartList());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete cart item.');
    }
  }
);

export const updateQty = createAsyncThunk(
  'cart/updateQty',
  async ({cartItemId, size, qty}: {cartItemId: string; size: string; qty: number}, {rejectWithValue}) => {
    try {
      const response = await api.put('/cart', {cartItemId, size, qty});
      return response.data;
    } catch (error: any) {
      console.error('UpdateQty API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || '옵션/수량 수정에 실패하였습니다.');
    }
  }
);

export const getCartQty = createAsyncThunk('cart/getCartQty', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get('cart/count');
    return response.data.count;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart quantity.');
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
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.error = null;
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action: PayloadAction<{data: CartItem[]}>) => {
        state.loading = false;
        state.error = null;

        const cartData = action.payload.data || [];

        state.cartList = cartData.map((item) => ({
          ...item,
          cartItemId: item.cartItemId || `${item.productId}_${item.size}`
        }));

        state.totalPrice = state.cartList.reduce((total, item) => total + item.productId.price * item.qty, 0);
      })

      .addCase(getCartList.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        // state.cartItemCount = 0;
      });
    builder.addCase(deleteCartItem.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCartItem.fulfilled, (state) => {
      state.loading = false;
      state.error = '';
    });
    builder.addCase(deleteCartItem.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateQty.pending, (state) => {
      state.loading = true;
    });
    builder
      .addCase(updateQty.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = false;
        state.error = '';
        const updatedItem = action.payload;

        // 카트 리스트에서 아이템 업데이트
        const index = state.cartList.findIndex((item) => item.cartItemId === updatedItem.cartItemId);
        if (index !== -1) {
          state.cartList[index] = updatedItem;
        }

        // 전체 가격 재계산
        state.totalPrice = state.cartList.reduce((total, item) => total + item.productId.price * item.qty, 0);
      })
      .addCase(updateQty.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.error = null;
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default cartSlice.reducer;
export const {initialCart} = cartSlice.actions;
