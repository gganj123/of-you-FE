var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { putQuery } from '../query/querySlice';
const initialState = {
    products: [],
    productDetail: null,
    loading: false,
    error: null,
    totalPageNum: 1,
    totalCount: 0,
    currentPage: 1,
    hasMoreProducts: true
};
// 상품 목록 가져오기 비동기 Thunk
export const fetchProducts = createAsyncThunk('products/fetchProducts', (params_1, _a) => __awaiter(void 0, [params_1, _a], void 0, function* (params, { rejectWithValue }) {
    var _b, _c;
    try {
        // mainCate와 subCate 추출
        const { mainCate, subCate } = params, queryParams = __rest(params, ["mainCate", "subCate"]);
        if (!mainCate) {
            throw new Error('mainCate is required but not provided.');
        }
        // 동적으로 엔드포인트 생성
        let endpoint = `/product/category/${mainCate}`;
        if (subCate) {
            endpoint += `/${subCate}`;
        }
        // API 호출
        const response = yield api.get(endpoint, { params: queryParams });
        return response.data;
    }
    catch (error) {
        console.error('API Fetch Error:', error);
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
    }
}));
export const searchProduct = createAsyncThunk('/product/searchProduct', (params_1, _a) => __awaiter(void 0, [params_1, _a], void 0, function* (params, { rejectWithValue, dispatch }) {
    var _b, _c;
    try {
        const { limit, name, page, sort } = params;
        if (name) {
            dispatch(putQuery({ content: name }));
        }
        const response = yield api.get('/product', { params: { limit, name, page, sort } });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
    }
}));
export const fetchProductDetail = createAsyncThunk(`product/fetchProductDetail`, (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.get(`/product/${id}`);
        return response.data.product;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
    }
}));
export const updateProduct = createAsyncThunk(`product/updateProduct`, (product_1, _a) => __awaiter(void 0, [product_1, _a], void 0, function* (product, { rejectWithValue, dispatch }) {
    var _b, _c;
    try {
        const response = yield api.put(`/product/${product._id}`, product);
        dispatch(getProductList({ page: 1, limit: 5 }));
        return response.data.product;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
    }
}));
export const deleteProduct = createAsyncThunk(`product/deleteProduct`, (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { rejectWithValue, dispatch }) {
    var _b, _c;
    try {
        const response = yield api.delete(`/product/${id}`);
        dispatch(getProductList({ page: 1, limit: 5 }));
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
    }
}));
export const createProduct = createAsyncThunk('products/createProduct', (formData_1, _a) => __awaiter(void 0, [formData_1, _a], void 0, function* (formData, { dispatch, rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.post('/product', formData);
        dispatch(getProductList({ page: 1, limit: 5 }));
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
    }
}));
export const getProductList = createAsyncThunk('products/getProductList', (query_1, _a) => __awaiter(void 0, [query_1, _a], void 0, function* (query, { rejectWithValue }) {
    var _b, _c;
    try {
        const response = yield api.get('/product', { params: Object.assign({}, query) });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
    }
}));
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProducts: (state) => {
            state.products = [];
        },
        clearProductDetail: (state) => {
            state.productDetail = null; // 상세 정보 초기화
        },
        clearError: (state) => {
            state.error = '';
            state.success = false;
        },
        addMoreProducts: (state, action) => {
            var _a;
            const newProducts = Array.isArray((_a = action.payload) === null || _a === void 0 ? void 0 : _a.products) ? action.payload.products : [];
            state.products = [...state.products, ...newProducts];
            state.currentPage += 1;
            state.hasMoreProducts = action.payload.products.length > 0;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
            state.totalPageNum = action.payload.totalPageNum;
            state.totalCount = action.payload.totalCount;
            state.currentPage = 1;
            state.hasMoreProducts = action.payload.products.length > 0;
        })
            .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            .addCase(searchProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(searchProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
            state.totalPageNum = action.payload.totalPageNum;
            state.totalCount = action.payload.totalCount;
            state.currentPage = 1;
            state.hasMoreProducts = action.payload.products.length > 0;
        })
            .addCase(searchProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder
            .addCase(fetchProductDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.productDetail = null;
        })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.productDetail = action.payload;
        })
            .addCase(fetchProductDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'Something went wrong.';
        })
            .addCase(deleteProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteProduct.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
            .addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'Something went wrong.';
        })
            .addCase(getProductList.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(getProductList.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
            state.totalPageNum = action.payload.totalPageNum;
            state.totalCount = action.payload.totalCount;
            state.error = '';
        })
            .addCase(getProductList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'Something went wrong.';
        })
            .addCase(updateProduct.pending, (state) => {
            state.success = false;
            state.loading = true;
            state.error = null;
        })
            .addCase(updateProduct.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
            state.error = '';
        })
            .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'Something went wrong.';
            state.success = false;
        })
            .addCase(createProduct.pending, (state) => {
            state.success = false;
            state.loading = true;
            state.error = null;
        })
            .addCase(createProduct.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
            state.error = '';
        })
            .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'Something went wrong.';
            state.success = false;
        });
    }
});
export const { clearProducts, clearProductDetail, clearError, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
