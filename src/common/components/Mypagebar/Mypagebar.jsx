import './Mypagebar.style.css';

const Mypagebar = () => {
  return (
    <section className='container'>
      <div className='sub-title-wrap'>
        <h2 className='sub-title'>MY PAGE</h2>
        <div className='breadcrumb-container'>
          <ol className='breadcrumb'>
            <li className='li-title'>HOME</li>
            <li className='li-title'>MY PAGE</li>
            <li className='li-title'>정보관리</li>
          </ol>
        </div>
      </div>

      <div className='snb_header'>
        <ul>
          <li>
            <a href='/mypage'>MY 🤍</a>
          </li>
          <li>
            <a href='/mypage/Order'>주문관리</a>
          </li>
          <li>
            <a href='/mypage/memberInfo'>정보관리</a>
          </li>
        </ul>
      </div>

      <div className='snb_sub'>
        <div className='inner'>
          <ul>
            <li>
              <a href='/mypage/like'>My 🤍 Like</a>
            </li>
            <li>
              <a href='/mypage/myreview'>My 🤍 Review</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href='/mypage/order'>주문/배송조회</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href='/mypage/address'>배송지관리</a>
            </li>
            <li>
              <a href='/mypage/secession'>회원탈퇴</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Mypagebar;
