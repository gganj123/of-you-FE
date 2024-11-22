import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../utils/api';

// 주소 목록 가져오기
export const getAddressList = createAsyncThunk('address/getAddressList', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get('/addresses');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 주소 추가하기
export const addAddress = createAsyncThunk('address/addAddress', async (newAddress, {rejectWithValue}) => {
  try {
    const response = await api.post('/addresses', newAddress);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 주소 수정하기
export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({addressId, updatedData}, {rejectWithValue}) => {
    try {
      const response = await api.put(`/addresses/${addressId}`, updatedData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 주소 삭제하기
export const deleteAddress = createAsyncThunk('address/deleteAddress', async (addressId, {rejectWithValue}) => {
  try {
    await api.delete(`/addresses/${addressId}`);
    return addressId; // 삭제된 주소 ID 반환
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Address Slice 생성
const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null
  },
  reducers: {
    resetAddresses: (state) => {
      state.addresses = []; // 주소 목록 초기화
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAddressList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressList.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload; // 주소 목록 업데이트
      })
      .addCase(getAddressList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // 에러 처리
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload); // 새 주소 추가
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // 에러 처리
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex((address) => address._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload; // 수정된 주소로 업데이트
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // 에러 처리
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter((address) => address._id !== action.payload); // 삭제된 주소 제거
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // 에러 처리
      });
  }
});

// 액션 및 리듀서 내보내기
export const {resetAddresses} = addressSlice.actions;

export default addressSlice.reducer;
