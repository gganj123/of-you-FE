import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRouter from './routes/AppRouter';
import AppLayout from './Layout/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getLikeList } from './features/like/likeSlice';
import ScrollToTop from './utils/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
function App() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.user);
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getLikeList());
        }
    }, [dispatch, isAuthenticated]);
    return (_jsx(GoogleOAuthProvider, { clientId: GOOGLE_CLIENT_ID, children: _jsxs(BrowserRouter, { children: [_jsx(ToastContainer, {}), _jsx(ScrollToTop, {}), _jsx(AppLayout, { children: _jsx(AppRouter, {}) })] }) }));
}
export default App;
