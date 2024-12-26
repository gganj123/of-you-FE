import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import api from '../../utils/api';

interface Query {
  id: string;
  content: string;
  [key: string]: any;
}

interface QueryState {
  queries: Query[];
  queryLoading: boolean;
  error: string | null;
}

const initialState: QueryState = {
  queries: [],
  queryLoading: false,
  error: null
};

interface putQueryParams {
  content: string;
  [key: string]: any;
}

export const putQuery = createAsyncThunk<Query, putQueryParams, {rejectValue: string}>(
  'query/putQuery',
  async (params, {rejectWithValue}) => {
    try {
      const response = await api.post('/query', params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const getQuery = createAsyncThunk<Query[], void, {rejectValue: string}>(
  'query/getQuery',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/query');

      return response.data.queries;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    clearQueries: (state) => {
      state.queries = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(putQuery.pending, (state) => {
        state.queryLoading = true;
      })
      .addCase(putQuery.fulfilled, (state) => {
        state.queryLoading = false;
        state.error = '';
      })
      .addCase(putQuery.rejected, (state, action: PayloadAction<any>) => {
        state.queryLoading = false;
        state.error = action.payload;
      })
      .addCase(getQuery.pending, (state) => {
        state.queryLoading = true;
      })
      .addCase(getQuery.fulfilled, (state, action: PayloadAction<Query[]>) => {
        state.queryLoading = false;
        state.queries = action.payload;
        state.error = null;
      })
      .addCase(getQuery.rejected, (state, action) => {
        state.queryLoading = false;
        state.error = action.payload || 'Failed to fetch queries';
      });
  }
});

export const {clearQueries} = querySlice.actions;

export default querySlice.reducer;
