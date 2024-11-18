import React from 'react';

const KakaoLoginButton = () => {
  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = import.meta.env.VITE_APP_KAKAO_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_APP_KAKAO_REDIRECT_URL;

    // 환경 변수 검증
    if (!KAKAO_CLIENT_ID || !REDIRECT_URI) {
      console.error('카카오 클라이언트 ID 또는 리다이렉트 URI가 설정되지 않았습니다.');
      setError('카카오 로그인 설정 오류입니다. 관리자에게 문의하세요.');
      return;
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button className='sns-signup' onClick={handleKakaoLogin}>
      카카오로 시작하기
    </button>
  );
};

export default KakaoLoginButton;
