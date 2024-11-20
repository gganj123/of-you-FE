import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 로컬 스토리지 사용
import {combineReducers} from 'redux';
import userSlice from './user/userSlice';
import productSlice from './product/productSlice';
import cartSlice from './cart/cartSlice';
import likeSlice from './like/likeSlice';
import orderSlice from './order/orderSlice';

// persist 설정
const persistConfig = {
  key: 'root',
  storage, // 로컬 스토리지에 상태 저장
  whitelist: ['user', 'like', 'cart'] // 유지할 슬라이스 지정
};

// 모든 리듀서를 결합
const rootReducer = combineReducers({
  user: userSlice,
  products: productSlice, // products는 필요에 따라 제외 가능
  cart: cartSlice,
  like: likeSlice,
  order: orderSlice
});

// persistReducer 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Redux Persist의 직렬화 경고 방지
    })
});

// Persistor 생성
export const persistor = persistStore(store);

export default store;
