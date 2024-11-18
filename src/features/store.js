import {configureStore} from '@reduxjs/toolkit';
import userSlice from './user/userSlice';
import productSlice from './product/productSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    products: productSlice
  }
});

export default store;
