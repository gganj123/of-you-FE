import {useEffect} from 'react';
import Navbar from '../common/components/Navbar/Navbar';
import Footer from '../common/components/Footer/Footer';
import './AppLayout.style.css';
import {useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loginWithToken} from '../features/user/userSlice';
import Mypagebar from '../common/components/Mypagebar/Mypagebar';

const AppLayout = ({children}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);
  const isMyPage = location.pathname.startsWith('/mypage');

  return (
    <div className='app-layout'>
      <Navbar user={user} />
      {isMyPage ? <Mypagebar /> : <main>{children}</main>}
      <Footer />
    </div>
  );
};

export default AppLayout;
