import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import api from '../../utils/api';

// Address 인터페이스 정의
interface Address {
  _id: string;
  shipto: {
    zip: string;
    address: string;
    city: string;
  };
  contact: {
    firstName: string;
    lastName: string;
    prefix: string;
    middle: string;
    last: string;
  };
  isDefault: boolean;
  [key: string]: any;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

// 초기 상태 정의
const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null
};

// 주소 목록 가져오기 Thunk
export const getAddressList = createAsyncThunk<Address[], void, {rejectValue: string}>(
  'address/getAddressList',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/addresses');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch address list');
    }
  }
);

// 주소 추가하기 Thunk
export const addAddress = createAsyncThunk<Address, Address, {rejectValue: string}>(
  'address/addAddress',
  async (newAddress, {rejectWithValue}) => {
    try {
      const response = await api.post('/addresses', newAddress);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add address');
    }
  }
);

// 주소 수정하기 Thunk
export const updateAddress = createAsyncThunk<
  Address,
  {addressId: string; updatedData: Partial<Address>},
  {rejectValue: string}
>('address/updateAddress', async ({addressId, updatedData}, {rejectWithValue}) => {
  try {
    const response = await api.put(`/addresses/${addressId}`, updatedData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update address');
  }
});

// 주소 삭제하기 Thunk
export const deleteAddress = createAsyncThunk<string, string, {rejectValue: string}>(
  'address/deleteAddress',
  async (addressId, {rejectWithValue}) => {
    try {
      await api.delete(`/addresses/${addressId}`);
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

// 기본 배송지 설정하기 Thunk
export const setDefaultAddress = createAsyncThunk<Address, string, {rejectValue: string}>(
  'address/setDefault',
  async (addressId, {rejectWithValue}) => {
    try {
      const response = await api.put(`/addresses/${addressId}/setDefault`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default address');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
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
      .addCase(getAddressList.fulfilled, (state, action: PayloadAction<Address[]>) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getAddressList.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch address list';
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add address';
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.loading = false;
        const index = state.addresses.findIndex((address) => address._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update address';
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.addresses = state.addresses.filter((address) => address._id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete address';
      })
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.loading = false;
        state.addresses = state.addresses.map((address) => ({
          ...address,
          isDefault: address._id === action.payload._id
        }));
      })
      .addCase(setDefaultAddress.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to set default address';
      });
  }
});

export const {resetAddresses} = addressSlice.actions;

export default addressSlice.reducer;
