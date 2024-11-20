import { Outlet, useLocation } from 'react-router-dom';
import Mypagebar from '../../common/components/Mypagebar/Mypagebar';
import { useWindowSize } from '../hooks/useWindowSize';
import './MyPage.style.css';

const Mypage = () => {
  const { width } = useWindowSize();
  const location = useLocation();
  const isMobileView = width <= 768;
  const isMainMyPage = location.pathname === '/mypage';

  return (
    <section className="mypage-container">
      {isMobileView ? (
        // 모바일 뷰
        isMainMyPage ? (
          // 메인 마이페이지에서는 메뉴만 보임
          <Mypagebar />
        ) : (
          // 서브페이지에서는 컨텐츠만 보임
          <div className="mypage-content">
            <Outlet />
          </div>
        )
      ) : (
        // PC 뷰 - 기존 레이아웃 유지
        <>
          <Mypagebar />
          <div className="mypage-content">
            <Outlet />
          </div>
        </>
      )}
    </section>
  );
};

export default Mypage;