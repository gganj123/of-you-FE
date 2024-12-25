import {BrowserRouter} from 'react-router-dom';
import {GoogleOAuthProvider} from '@react-oauth/google';
import AppRouter from './routes/AppRouter';
import AppLayout from './Layout/AppLayout';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {getLikeList} from './features/like/likeSlice';
import ScrollToTop from './utils/ScrollToTop';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {RootState, AppDispatch} from './features/store';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID as string;

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getLikeList());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ToastContainer />
        <ScrollToTop />
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
