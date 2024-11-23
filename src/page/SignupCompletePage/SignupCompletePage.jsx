import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupCompletePage.style.css';

const SignupCompletePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  }

  return (
    <div className="join_complete_wrap">
      <div className="join_complete_inner">
        <h1 className="join_complete_tit">JOIN MEMBER</h1>
        <div className="join_complete_line"></div>

        <div>
          <h2 className="join_complete_welcome">OF YOU PEOPLE이 되신 것을 환영합니다!</h2>
          <p className="join_complete_desc">OF YOU와 함께 나다운 컨셉을 완성해보세요.</p>
          <button className="join_complete_btn" onClick={handleLoginClick}>로그인하러 가기</button>
        </div>
      </div>
    </div>
  );
};

export default SignupCompletePage;