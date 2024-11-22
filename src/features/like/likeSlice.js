import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getLikeList = createAsyncThunk('like/getLikeList', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get('/like');
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '토큰이 없습니다');
  }
});

export const toggleLike = createAsyncThunk('like/toggleLike', async (productId, {rejectWithValue}) => {
  try {
    const response = await api.post(`/like/${productId}`);

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const likeSlice = createSlice({
  name: 'like',
  initialState: {
    likes: [],
    loading: false,
    error: null
  },
  reducers: {
    resetLikes: (state) => {
      state.likes = []; // likes 초기화
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
        state.likes = action.payload.filter((like) => like.productId); // productId가 null이 아닌 항목만 유지
      })
      .addCase(getLikeList.rejected, (state, action) => {
        console.error('Error fetching likes:', action.payload); // 확인용

        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        if (state.likes.some((like) => like.productId === productId)) {
          // 좋아요 제거
          state.likes = state.likes.filter((like) => like.productId !== productId);
        } else {
          // 좋아요 추가
          state.likes.push({productId});
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      });
  }
});
export const {resetLikes} = likeSlice.actions;

export default likeSlice.reducer;
