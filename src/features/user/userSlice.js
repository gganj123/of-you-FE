import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';
import {initialCart} from '../cart/cartSlice';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({email, name, password}, {rejectWithValue}) => {
    try {
      const response = await api.post('/user', {email, name, password});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteUser = createAsyncThunk('user/deleteUser', async (_, {rejectWithValue}) => {
  try {
    const response = await api.delete('/user/delete');
    return '탈퇴완료';
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '탈퇴를 실패하였습니다.');
  }
});

export const loginWithEmail = createAsyncThunk(
  'user/loginWithEmail',

  async ({email, password}, thunkAPI) => {
    const {rejectWithValue} = thunkAPI;
    try {
      const response = await api.post('/auth/login', {email, password});
      sessionStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '이메일과 비밀번호를 확인해주세요');
    }
  }
);

export const loginWithGoogle = createAsyncThunk('user/loginWithGoogle', async (token, {rejectWithValue}) => {
  try {
    const response = await api.post('auth/google', {token});
    sessionStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Google login failed');
  }
});

export const fetchKakaoToken = createAsyncThunk('user/fetchKakaoToken', async (_, thunkAPI) => {
  try {
    const response = await fetch('/api/auth/kakao/callback');
    const data = await response.json();
    return data.token;
  } catch (error) {
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
  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const logout = () => (dispatch) => {
  sessionStorage.removeItem('token');
  dispatch(userSlice.actions.logout());
  dispatch(initialCart());
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
    token: null,
    status: 'idle'
  },
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
      .addCase(registerUser.pending, (state, action) => {
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
      .addCase(loginWithEmail.pending, (state, action) => {
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
      .addCase(loginWithGoogle.pending, (state, action) => {
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
export const {clearErrors} = userSlice.actions;

export default userSlice.reducer;
