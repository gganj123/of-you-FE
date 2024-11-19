import {BrowserRouter} from 'react-router-dom';
import {GoogleOAuthProvider} from '@react-oauth/google';
import AppRouter from './routes/AppRouter';
import AppLayout from './Layout/AppLayout';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {getLikeList} from './features/like/likeSlice';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // 좋아요 리스트 초기화
    dispatch(getLikeList());
  }, [dispatch]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
