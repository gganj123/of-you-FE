import {configureStore} from '@reduxjs/toolkit';
import userSlice from './user/userSlice';
import productSlice from './product/productSlice';
import cartSlice from './cart/cartSlice';
import likeSlice from './like/likeSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    products: productSlice,
    cart: cartSlice,
    like: likeSlice
  }
});

export default store;
