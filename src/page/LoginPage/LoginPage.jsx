import {useEffect, useState} from 'react';
import '../../App.css';
import './style/LoginPage.style.css';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {loginWithEmail, loginWithGoogle, fetchKakaoToken} from '../../features/user/userSlice';
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';
import {clearErrors} from '../../features/user/userSlice';
import {getLikeList} from '../../features/like/likeSlice';
import {getCartQty} from '../../features/cart/cartSlice';
import KakaoLoginButton from './KakaoLoginButton';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, loginError} = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [error, setError] = useState('');
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    setError('');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (loginError) {
      setError('이메일과 비밀번호를 확인해주세요');
      dispatch(clearErrors());
    }
  }, [loginError, dispatch]);

  const navigateSignupPage = () => {
    navigate('/signup');
  };

  const handleRememberEmailChange = (e) => {
    setRememberEmail(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem('savedEmail');
      setEmail('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLoginWithEmail(e);
    }
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!email) {
      setError('이메일을 입력해 주세요.');
      return;
    }
    if (!password) {
      setError('이메일과 비밀번호를 확인해 주세요.');
      return;
    }

    // 이메일 저장
    if (rememberEmail) {
      localStorage.setItem('savedEmail', email);
    }

    try {
      const result = await dispatch(loginWithEmail({email, password})).unwrap(); // 로그인 성공 여부 확인
      if (result) {
        dispatch(getLikeList()); // 좋아요 리스트 가져오기
        dispatch(getCartQty()); // 카트 아이템 수량 가져오기
      }
    } catch (error) {
      setError(error || '로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleGoogleLogin = async (googleData) => {
    //구글 로그인 하기
    dispatch(loginWithGoogle(googleData.credential));
  };

  return (
    <div className='login-page-wrapper'>
      <div className='login-page-content'>
        <div className='login-form-wrapper'>
          <h2 className='login-title'>LOGIN</h2>
          <form className='login-form' onSubmit={handleLoginWithEmail}>
            <div className='input-group'>
              <label htmlFor='email' className='input-label'>
                이메일 아이디
              </label>
              <input
                type='text'
                id='email'
                className='input-field'
                placeholder='이메일을 입력해주세요'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='input-group'>
              <label htmlFor='password' className='input-label'>
                비밀번호
              </label>
              <input
                type='password'
                id='password'
                className='input-field'
                placeholder='영문+숫자 조합 8~16자리'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className='error-message'>{error}</p>}
            <button type='submit' className='login-button'>
              로그인
            </button>
          </form>
          <div className='login-options'>
            <div className='remember-email'>
              <label className='checkbox-label'>
                <input
                  type='checkbox'
                  checked={rememberEmail}
                  onChange={handleRememberEmailChange}
                  className='checkbox-input'
                />
                <span className='checkbox-custom'></span>
                이메일 저장
              </label>
            </div>
          </div>
        </div>
        <div className='join-wrapper'>
          <div className='join-email'>
            <p className='join-content'>이메일로 간편하고 빠르게 회원가입하세요</p>
            <button className='join-button' onClick={navigateSignupPage}>
              이메일로 가입하기
            </button>
          </div>
          <div className='join-sns'>
            <p className='join-content'>SNS계정으로 OF YOU를 이용해보세요</p>
            <div className='sns-buttons'>
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log('Login Failed')}
                  render={(renderProps) => (
                    <button
                      className='custom-google-login-button'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}>
                      <div className='custom-google-login-content'>
                        <img
                          src='/images/g-logo.png'
                          alt='Google Logo'
                          className='custom-google-icon'
                          style={{width: '64px', height: '64px'}}
                        />
                        <span className='custom-google-login-text'>구글로 시작하기</span>
                      </div>
                    </button>
                  )}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
