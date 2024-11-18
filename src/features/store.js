import {configureStore} from '@reduxjs/toolkit';
import userSlice from './user/userSlice';
import productSlice from './product/productSlice';
import cartSlice from './cart/cartSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    products: productSlice,
    cart: cartSlice
  }
});

export default store;
