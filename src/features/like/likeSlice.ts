import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import api from '../../utils/api';

interface Like {
  productId: string | {_id: string};
}

interface LikeState {
  likes: Like[];
  loading: boolean;
  error: string | null;
}

const initialState: LikeState = {
  likes: [],
  loading: false,
  error: null
};

export const getLikeList = createAsyncThunk<Like[], void, {rejectValue: string}>(
  'like/getLikeList',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/like');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch likes');
    }
  }
);

export const toggleLike = createAsyncThunk<string, string, {rejectValue: string}>(
  'like/toggleLike',
  async (productId, {rejectWithValue}) => {
    try {
      const response = await api.post(`/like/${productId}`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    resetLikes: (state) => {
      state.likes = []; // 좋아요 리스트 초기화
    },
    toggleLikeOptimistic: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingLikeIndex = state.likes.findIndex(
        (like) => (typeof like.productId === 'string' ? like.productId : like.productId._id) === productId
      );

      if (existingLikeIndex !== -1) {
        state.likes.splice(existingLikeIndex, 1); // 좋아요 제거
      } else {
        state.likes.push({productId}); // 좋아요 추가
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLikeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLikeList.fulfilled, (state, action: PayloadAction<Like[]>) => {
        state.loading = false;
        state.likes = action.payload.filter((like) => like.productId);
      })
      .addCase(getLikeList.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch likes';
      })
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        const productId = action.payload;
        const existingLikeIndex = state.likes.findIndex(
          (like) => (typeof like.productId === 'string' ? like.productId : like.productId._id) === productId
        );

        if (existingLikeIndex !== -1) {
          state.likes.splice(existingLikeIndex, 1); // 좋아요 제거
        } else {
          state.likes.push({productId}); // 좋아요 추가
        }
      })
      .addCase(toggleLike.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to toggle like';
      });
  }
});
export const {resetLikes, toggleLikeOptimistic} = likeSlice.actions;

export default likeSlice.reducer;
