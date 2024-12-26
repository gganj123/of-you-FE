import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer, PersistConfig} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {combineReducers} from 'redux';
import userSlice from './user/userSlice';
import productSlice from './product/productSlice';
import cartSlice from './cart/cartSlice';
import likeSlice from './like/likeSlice';
import orderSlice from './order/orderSlice';
import addressSlice from './address/addressSlice';
import querySlice from './query/querySlice';

// Root state 타입 정의
const rootReducer = combineReducers({
  user: userSlice,
  products: productSlice,
  cart: cartSlice,
  like: likeSlice,
  order: orderSlice,
  address: addressSlice,
  query: querySlice
});

export type RootState = ReturnType<typeof rootReducer>;

// Persist config 타입 정의
type PersistConfigType = PersistConfig<RootState> & {
  whitelist: (keyof RootState)[];
};

const persistConfig: PersistConfigType = {
  key: 'root',
  storage,
  whitelist: ['user', 'like', 'cart', 'address']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;