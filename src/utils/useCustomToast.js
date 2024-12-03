import {toast} from 'react-toastify';
import './useCustomToast.css';

const useCustomToast = () => {
  const showInfo = (message) => {
    toast.info(message, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true
    });
  };

  return {showInfo, showSuccess, showError};
};

export default useCustomToast;
