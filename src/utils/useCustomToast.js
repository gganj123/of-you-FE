import {toast} from 'react-toastify';
import './useCustomToast.css';

const useCustomToast = () => {
  const showInfo = (message) => {
    toast.info(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: 'dark'
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: 'dark'
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: 'dark'
    });
  };

  return {showInfo, showSuccess, showError};
};

export default useCustomToast;
