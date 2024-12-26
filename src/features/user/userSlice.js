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
import { initialCart } from '../cart/cartSlice';
const initialState = {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
    token: null,
    status: 'idle'
};
export const registerUser = createAsyncThunk('user/registerUser', (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ email, name, password }, { rejectWithValue }) {
    var _c, _d;
    try {
        const response = yield api.post('/user', { email, name, password });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || 'Registration failed');
    }
}));
export const deleteUser = createAsyncThunk('user/deleteUser', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    var _b, _c;
    try {
        yield api.delete('/user/delete');
        return '탈퇴완료';
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || '탈퇴를 실패하였습니다.');
    }
}));
export const loginWithEmail = createAsyncThunk('user/loginWithEmail', (_a, thunkAPI_1) => __awaiter(void 0, [_a, thunkAPI_1], void 0, function* ({ email, password }, thunkAPI) {
    var _b, _c;
    const { rejectWithValue } = thunkAPI;
    try {
        const response = yield api.post('/auth/login', { email, password });
        sessionStorage.setItem('token', response.data.token);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || '이메일과 비밀번호를 확인해주세요');
    }
}));
export const loginWithGoogle = createAsyncThunk('user/loginWithGoogle', (token_1, _a) => __awaiter(void 0, [token_1, _a], void 0, function* (token, { rejectWithValue }) {
    var _b;
    try {
        const response = yield api.post('auth/google', { token });
        sessionStorage.setItem('token', response.data.token);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || 'Google login failed');
    }
}));
export const fetchKakaoToken = createAsyncThunk('user/fetchKakaoToken', (_, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('/api/auth/kakao/callback');
        const data = yield response.json();
        return data.token;
    }
    catch (error) {
        console.error('로그인 후 처리 중 오류 발생:', error);
        return thunkAPI.rejectWithValue(error.message);
    }
}));
export const loginWithToken = createAsyncThunk('user/loginWithToken', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    var _b;
    const token = sessionStorage.getItem('token');
    if (!token) {
        return rejectWithValue('No token found, skipping request');
    }
    try {
        const response = yield api.get('/user/me');
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || 'An error occurred');
    }
}));
export const logout = () => (dispatch) => {
    sessionStorage.removeItem('token');
    dispatch(userSlice.actions.logout());
    dispatch(initialCart());
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.loginError = null;
            state.registrationError = null;
        },
        logout: (state) => {
            state.user = null;
            state.loginError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
            state.loading = true;
        })
            .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.loginError = null;
        })
            .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.loginError = action.payload;
        })
            .addCase(loginWithEmail.pending, (state) => {
            state.loading = true;
        })
            .addCase(loginWithEmail.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
        })
            .addCase(loginWithEmail.rejected, (state, action) => {
            state.loading = false;
            state.loginError = action.payload;
        })
            .addCase(loginWithToken.pending, (state) => {
            state.loading = true;
        })
            .addCase(loginWithToken.fulfilled, (state, action) => {
            state.user = action.payload.user;
        })
            .addCase(loginWithToken.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            sessionStorage.removeItem('token');
            state.error = action.payload;
        })
            .addCase(loginWithGoogle.pending, (state) => {
            state.loading = true;
        })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.loginError = null;
        })
            .addCase(loginWithGoogle.rejected, (state, action) => {
            state.loading = false;
            state.loginError = action.payload;
        })
            .addCase(fetchKakaoToken.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(fetchKakaoToken.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        })
            .addCase(fetchKakaoToken.rejected, (state, action) => {
            state.status = 'failed';
            state.loginError = action.payload;
        })
            .addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteUser.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
        })
            .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
