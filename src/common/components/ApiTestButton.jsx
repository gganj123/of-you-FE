import {useState} from 'react';
import axios from '../../utils/api';

const ApiTestButton = () => {
  const [apiStatus, setApiStatus] = useState(''); // API 응답 상태 저장

  const handleApiCheck = () => {
    axios
      .get('/')
      .then((response) => {
        setApiStatus('API 연결 성공: ' + response.data.message);
      })
      .catch((error) => {
        setApiStatus('API 연결 실패: ' + error.message);
      });
  };

  return (
    <div>
      <button onClick={handleApiCheck}>API 연결 테스트</button>
      {apiStatus && <p>{apiStatus}</p>}
    </div>
  );
};

export default ApiTestButton;
