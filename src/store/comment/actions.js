import { ActionKey } from './contants.js';

const startFetchingComments = () => {
  return {
    type: ActionKey.START_COMMENT,
  };
};

const fetchCommentSuccess = (comments) => {
  return {
    type: ActionKey.SUCCESS_COMMENT,
    payload: {
      comments: comments,
    },
  };
};

const fetchCommentError = (error) => {
  return {
    type: ActionKey.SUCCESS_COMMENT,
    payload: {
      error: error,
    },
  };
};

export const fetchComment = () => {
  return (dispatch) => {
    dispatch(startFetchingComments());
    return fetch('https://jsonplaceholder.typicode.com/comments')
      .then((response) => response.json())
      .then((data) => {
        dispatch(fetchCommentSuccess(data));
      })
      .catch((error) => {
        dispatch(fetchCommentError(error));
      });
  };
};
