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
            <a href='/MyPage'>MY 🤍</a>
          </li>
          <li>
            <a href='/MyPage/Order'>주문관리</a>
          </li>
          <li>
            <a href='/MyPage/MemberInfo'>정보관리</a>
          </li>
        </ul>
      </div>

      <div className='snb_sub'>
        <div className='inner'>
          <ul>
            <li>
              <a href='/MyPage/MyHeart'>My 🤍 Like</a>
            </li>
            <li>
              <a href='/MyPage/MyReview'>My 🤍 Review</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href='/MyPage/Order'>주문/배송조회</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href='/MyPage/Address'>배송지관리</a>
            </li>
            <li>
              <a href='/MyPage/Secession'>회원탈퇴</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Mypagebar;
