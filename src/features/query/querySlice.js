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
    queries: [],
    queryLoading: false,
    error: null
};
export const putQuery = createAsyncThunk('query/putQuery', (params_1, _a) => __awaiter(void 0, [params_1, _a], void 0, function* (params, { rejectWithValue }) {
    var _b;
    try {
        const response = yield api.post('/query', params);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || 'An error occurred');
    }
}));
export const getQuery = createAsyncThunk('query/getQuery', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    var _b;
    try {
        const response = yield api.get('/query');
        return response.data.queries;
    }
    catch (error) {
        return rejectWithValue(((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || 'An error occurred');
    }
}));
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
            .addCase(putQuery.rejected, (state, action) => {
            state.queryLoading = false;
            state.error = action.payload;
        })
            .addCase(getQuery.pending, (state) => {
            state.queryLoading = true;
        })
            .addCase(getQuery.fulfilled, (state, action) => {
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
export const { clearQueries } = querySlice.actions;
export default querySlice.reducer;
