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
    return addressId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 기본 배송지 설정하기
export const setDefaultAddress = createAsyncThunk('address/setDefault', async (addressId, {rejectWithValue}) => {
  try {
    const response = await api.put(`/addresses/${addressId}/setDefault`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null
  },
  reducers: {
    resetAddresses: (state) => {
      state.addresses = [];
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
        state.addresses = action.payload;
      })
      .addCase(getAddressList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex((address) => address._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter((address) => address._id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.map((address) => ({
          ...address,
          isDefault: address._id === action.payload._id
        }));
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {resetAddresses} = addressSlice.actions;

export default addressSlice.reducer;
