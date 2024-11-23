import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const putQuery = createAsyncThunk('query/putQuery', async (params, {rejectWithValue}) => {
  try {
    const response = await api.post('/query', params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getQuery = createAsyncThunk('query/getQuery', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get('/query');

    return response.data.queries;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const querySlice = createSlice({
  name: 'query',
  initialState: {
    queries: [],
    queryLoading: false,
    error: ''
  },
  reducers: {
    clearQueries: (state) => {
      state.queries = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(putQuery.pending, (state, action) => {
        state.queryLoading = true;
      })
      .addCase(putQuery.fulfilled, (state, action) => {
        state.queryLoading = false;
        state.error = '';
      })
      .addCase(putQuery.rejected, (state, action) => {
        state.queryLoading = false;
        state.error = action.payload;
      })
      .addCase(getQuery.pending, (state, action) => {
        state.queryLoading = true;
      })
      .addCase(getQuery.fulfilled, (state, action) => {
        state.queryLoading = false;
        state.queries = action.payload;
        state.error = '';
      })
      .addCase(getQuery.rejected, (state, action) => {
        state.queryLoading = false;
        state.error = action.payload;
      });
  }
});

export const {clearQueries} = querySlice.actions;

export default querySlice.reducer;
