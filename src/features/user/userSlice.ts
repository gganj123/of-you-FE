import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import api from '../../utils/api';
import {initialCart} from '../cart/cartSlice';

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  loginError: string | null;
  registrationError: string | null;
  success: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  loginError: null,
  registrationError: null,
  success: false,
  token: null,
  status: 'idle'
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({email, name, password}: {email: string; name: string; password: string}, {rejectWithValue}) => {
    try {
      const response = await api.post('/user', {email, name, password});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const deleteUser = createAsyncThunk('user/deleteUser', async (_, {rejectWithValue}) => {
  try {
    await api.delete('/user/delete');
    return '탈퇴완료';
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || '탈퇴를 실패하였습니다.');
  }
});

export const loginWithEmail = createAsyncThunk(
  'user/loginWithEmail',

  async ({email, password}: {email: string; password: string}, thunkAPI) => {
    const {rejectWithValue} = thunkAPI;
    try {
      const response = await api.post('/auth/login', {email, password});
      sessionStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '이메일과 비밀번호를 확인해주세요');
    }
  }
);

export const loginWithGoogle = createAsyncThunk('user/loginWithGoogle', async (token: string, {rejectWithValue}) => {
  try {
    const response = await api.post('auth/google', {token});
    sessionStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Google login failed');
  }
});

export const fetchKakaoToken = createAsyncThunk('user/fetchKakaoToken', async (_, thunkAPI) => {
  try {
    const response = await fetch('/api/auth/kakao/callback');
    const data = await response.json();
    return data.token;
  } catch (error: any) {
    console.error('로그인 후 처리 중 오류 발생:', error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const loginWithToken = createAsyncThunk('user/loginWithToken', async (_, {rejectWithValue}) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return rejectWithValue('No token found, skipping request');
  }

  try {
    const response = await api.get('/user/me');

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const logout = () => (dispatch: any) => {
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
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{user: UserInfo}>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action: PayloadAction<{user: UserInfo}>) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginWithEmail.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithToken.fulfilled, (state, action: PayloadAction<{user: UserInfo}>) => {
        state.user = action.payload.user;
      })
      .addCase(loginWithToken.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = null;
        sessionStorage.removeItem('token');
        state.error = action.payload;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<{user: UserInfo}>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(fetchKakaoToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKakaoToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.token = action.payload;
        localStorage.setItem('token', action.payload);
      })
      .addCase(fetchKakaoToken.rejected, (state, action: PayloadAction<any>) => {
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
      .addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});
export const {clearErrors} = userSlice.actions;

export default userSlice.reducer;
