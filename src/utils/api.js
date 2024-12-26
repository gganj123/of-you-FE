import axios from 'axios';
// VITE_APP_API_BASE_URL 값이 올바르게 설정되어 있는지 확인
if (!import.meta.env.VITE_APP_API_BASE_URL) {
    throw new Error('VITE_APP_API_BASE_URL is not defined in your environment variables.');
}
const api = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}/api`, // API 기본 URL 설정
    headers: {
        'Content-Type': 'application/json', // 요청 헤더에 JSON 형식 설정
        authorization: `Bearer ${sessionStorage.getItem('token')}` // 인증 토큰 추가
    }
});
// 요청 인터셉터 설정
api.interceptors.request.use((request) => {
    if (request.headers) {
        request.headers.authorization = `Bearer ${sessionStorage.getItem('token')}`; // 인증 토큰 갱신
    }
    return request;
}, (error) => {
    return Promise.reject(error); // 요청 에러 처리
});
// 응답 인터셉터 설정
api.interceptors.response.use((response) => {
    return response; // 성공적인 응답 반환
}, (error) => {
    var _a;
    const responseError = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || 'An error occurred'; // 응답 에러 처리
    return Promise.reject(responseError);
});
export default api;
