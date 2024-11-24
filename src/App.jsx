import {BrowserRouter} from 'react-router-dom';
import {GoogleOAuthProvider} from '@react-oauth/google';
import AppRouter from './routes/AppRouter';
import AppLayout from './Layout/AppLayout';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {getLikeList} from './features/like/likeSlice';
import ScrollToTop from './utils/ScrollToTop';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

function App() {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state) => state.user); // 로그인 상태 확인

  useEffect(() => {
    if (isAuthenticated) {
      // 로그인한 사용자만 좋아요 리스트 호출
      dispatch(getLikeList());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ScrollToTop />
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
