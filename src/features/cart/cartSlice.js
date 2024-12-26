var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
const initialState = {
    loading: false,
    error: null,
    cartList: [],
    selectedItem: null,
    cartItemCount: 0,
    totalPrice: 0
};
export const addToCart = createAsyncThunk('cart/addToCart', (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ cartItems }, { rejectWithValue, dispatch }) {
    var _c, _d;
    try {
        const response = yield api.post('/cart', { cartItems });
        dispatch(getCartQty());
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || 'Failed to add item to cart.');
    }
}));
export const getCartList = createAsyncThunk('cart/getCartList', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.get('/cart');
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to fetch cart list');
    }
}));
export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { rejectWithValue, dispatch }) {
    var _b, _c;
    try {
        const response = yield api.delete(`/cart/${id}`);
        dispatch(getCartQty());
        dispatch(getCartList());
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to delete cart item.');
    }
}));
export const updateQty = createAsyncThunk('cart/updateQty', (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ cartItemId, size, qty }, { rejectWithValue }) {
    var _c, _d;
    try {
        const response = yield api.put('/cart', { cartItemId, size, qty });
        return response.data;
    }
    catch (error) {
        console.error('UpdateQty API Error:', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message);
        return rejectWithValue(((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || '옵션/수량 수정에 실패하였습니다.');
    }
}));
export const getCartQty = createAsyncThunk('cart/getCartQty', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.get('cart/count');
        return response.data.count;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to fetch cart quantity.');
    }
}));
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
            .addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.cartItemCount = action.payload;
        })
            .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            .addCase(getCartList.pending, (state) => {
            state.loading = true;
        })
            .addCase(getCartList.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            const cartData = action.payload.data || [];
            state.cartList = cartData.map((item) => (Object.assign(Object.assign({}, item), { cartItemId: item.cartItemId || `${item.productId}_${item.size}` })));
            state.totalPrice = state.cartList.reduce((total, item) => total + item.productId.price * item.qty, 0);
        })
            .addCase(getCartList.rejected, (state, action) => {
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
        builder.addCase(deleteCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(updateQty.pending, (state) => {
            state.loading = true;
        });
        builder
            .addCase(updateQty.fulfilled, (state, action) => {
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
            .addCase(updateQty.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            .addCase(getCartQty.pending, (state) => {
            state.loading = true;
        })
            .addCase(getCartQty.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.cartItemCount = action.payload;
        })
            .addCase(getCartQty.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});
export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
