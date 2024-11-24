import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';
import {getCartList, getCartQty} from '../cart/cartSlice';

// 비동기 주문 생성 액션
export const createOrder = createAsyncThunk('order/createOrder', async (orderData, {rejectWithValue, dispatch}) => {
  try {
    const response = await api.post('/order', orderData); // 주문 API 호출
    dispatch(getCartQty());

    return response.data; // 성공 시 데이터 반환
  } catch (error) {
    // 실패 시 에러 메시지 반환
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchOrder = createAsyncThunk('/order/fetchOrder', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get('/order');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getOrderList = createAsyncThunk('order/getOrderList', async (query, {rejectWithValue}) => {
  try {
    const response = await api.get('/order/admin', {params: {...query}});
    return {
      orders: response.data.orders,
      totalPageNum: response.data.totalPageNum,
      totalCount: response.data.totalCount
    };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({orderId, newStatus}, {rejectWithValue}) => {
    try {
      const response = await api.put(`/order/${orderId}`, {
        status: newStatus
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 주문 관련 슬라이스
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderList: [],
    order: null, // 주문 데이터
    loading: false,
    error: null, // 에러 메시지
    totalCount: 0,
    totalPageNum: 0
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        dispatch(getCartList());
        state.order = action.payload.orderNum;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.orders;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderList.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalPageNum = action.payload.totalPageNum;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order));
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {resetOrderState} = orderSlice.actions;

export default orderSlice.reducer;
