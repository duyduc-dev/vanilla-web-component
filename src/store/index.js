import commentReducer from './comment/reducer.js';
import { createStore } from '../core/store/index.js';

const rootReducer = () => ({
  comment: commentReducer,
});

const store = createStore(rootReducer);

export const { connect } = store;
