import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getLikeList = createAsyncThunk('like/getLikeList', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get('/like');
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error);
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
      state.likes = [];
    },
    toggleLikeOptimistic: (state, action) => {
      const productId = action.payload;

      const existingLikeIndex = state.likes.findIndex((like) => (like.productId?._id || like.productId) === productId);

      if (existingLikeIndex !== -1) {
        state.likes.splice(existingLikeIndex, 1);
      } else {
        state.likes.push({productId});
      }
    },
    resetLikes: (state) => {
      state.likes = [];
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
        console.error('Error fetching likes:', action.payload);
        state.likes = action.payload.filter((like) => like.productId);

        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.payload;
        if (state.likes.some((like) => like.productId === productId)) {
          state.likes = state.likes.filter((like) => like.productId !== productId);
        } else {
          state.likes.push({productId});
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      });
  }
});
export const {resetLikes, toggleLikeOptimistic} = likeSlice.actions;

export default likeSlice.reducer;
