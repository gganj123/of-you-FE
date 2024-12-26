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
const initialState = {
    likes: [],
    loading: false,
    error: null
};
export const getLikeList = createAsyncThunk('like/getLikeList', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.get('/like');
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to fetch likes');
    }
}));
export const toggleLike = createAsyncThunk('like/toggleLike', (productId_1, _a) => __awaiter(void 0, [productId_1, _a], void 0, function* (productId, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.post(`/like/${productId}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
    }
}));
const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {
        resetLikes: (state) => {
            state.likes = []; // 좋아요 리스트 초기화
        },
        toggleLikeOptimistic: (state, action) => {
            const productId = action.payload;
            const existingLikeIndex = state.likes.findIndex((like) => (typeof like.productId === 'string' ? like.productId : like.productId._id) === productId);
            if (existingLikeIndex !== -1) {
                state.likes.splice(existingLikeIndex, 1); // 좋아요 제거
            }
            else {
                state.likes.push({ productId }); // 좋아요 추가
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLikeList.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(getLikeList.fulfilled, (state, action) => {
            state.loading = false;
            state.likes = action.payload.filter((like) => like.productId);
        })
            .addCase(getLikeList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch likes';
        })
            .addCase(toggleLike.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(toggleLike.fulfilled, (state, action) => {
            state.loading = false;
            const productId = action.payload;
            const existingLikeIndex = state.likes.findIndex((like) => (typeof like.productId === 'string' ? like.productId : like.productId._id) === productId);
            if (existingLikeIndex !== -1) {
                state.likes.splice(existingLikeIndex, 1); // 좋아요 제거
            }
            else {
                state.likes.push({ productId }); // 좋아요 추가
            }
        })
            .addCase(toggleLike.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to toggle like';
        });
    }
});
export const { resetLikes, toggleLikeOptimistic } = likeSlice.actions;
export default likeSlice.reducer;
