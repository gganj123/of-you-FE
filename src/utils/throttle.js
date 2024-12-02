import {throttle} from 'lodash';
import {toggleLike, toggleLikeOptimistic} from '../../../features/like/likeSlice';

const throttledLikeHandler = throttle((id, dispatch) => {
  dispatch(toggleLikeOptimistic(id));
  dispatch(toggleLike(id)).catch((error) => {
    console.error('좋아요 토글 실패:', error);
    dispatch(toggleLikeOptimistic(id));
  });
}, 300);

const handleLikeClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  throttledLikeHandler(id, dispatch);
};
