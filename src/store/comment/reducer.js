import { ActionKey } from './contants.js';

const initialState = {
  fetching: false,
  error: null,
  comments: [],
};

const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionKey.START_COMMENT:
      return {
        ...state,
        fetching: true,
        error: null,
      };
    case ActionKey.SUCCESS_COMMENT:
      return {
        ...state,
        fetching: false,
        comments: action.payload.comments,
      };
    case ActionKey.ERROR_COMMENT:
      return {
        ...state,
        fetching: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default commentReducer;
