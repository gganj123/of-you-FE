import {toast} from 'react-toastify';

const useToast = () => {
  const showInfo = (message) => {
    toast.info(message, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true
    });
  };

  return {showInfo, showSuccess, showError};
};

export default useToast;
