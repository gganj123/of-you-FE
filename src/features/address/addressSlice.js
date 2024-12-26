var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';
// 초기 상태 정의
const initialState = {
    addresses: [],
    loading: false,
    error: null
};
// 주소 목록 가져오기 Thunk
export const getAddressList = createAsyncThunk('address/getAddressList', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.get('/addresses');
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to fetch address list');
    }
}));
// 주소 추가하기 Thunk
export const addAddress = createAsyncThunk('address/addAddress', (newAddress_1, _a) => __awaiter(void 0, [newAddress_1, _a], void 0, function* (newAddress, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.post('/addresses', newAddress);
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to add address');
    }
}));
// 주소 수정하기 Thunk
export const updateAddress = createAsyncThunk('address/updateAddress', (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ addressId, updatedData }, { rejectWithValue }) {
    var _c, _d;
    try {
        const response = yield api.put(`/addresses/${addressId}`, updatedData);
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || 'Failed to update address');
    }
}));
// 주소 삭제하기 Thunk
export const deleteAddress = createAsyncThunk('address/deleteAddress', (addressId_1, _a) => __awaiter(void 0, [addressId_1, _a], void 0, function* (addressId, { rejectWithValue }) {
    var _b, _c;
    try {
        yield api.delete(`/addresses/${addressId}`);
        return addressId;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to delete address');
    }
}));
// 기본 배송지 설정하기 Thunk
export const setDefaultAddress = createAsyncThunk('address/setDefault', (addressId_1, _a) => __awaiter(void 0, [addressId_1, _a], void 0, function* (addressId, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.put(`/addresses/${addressId}/setDefault`);
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to set default address');
    }
}));
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
            .addCase(getAddressList.fulfilled, (state, action) => {
            state.loading = false;
            state.addresses = action.payload;
        })
            .addCase(getAddressList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch address list';
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
            state.error = action.payload || 'Failed to add address';
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
            state.error = action.payload || 'Failed to update address';
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
            state.error = action.payload || 'Failed to delete address';
        })
            .addCase(setDefaultAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.addresses = state.addresses.map((address) => (Object.assign(Object.assign({}, address), { isDefault: address._id === action.payload._id })));
        })
            .addCase(setDefaultAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to set default address';
        });
    }
});
export const { resetAddresses } = addressSlice.actions;
export default addressSlice.reducer;
