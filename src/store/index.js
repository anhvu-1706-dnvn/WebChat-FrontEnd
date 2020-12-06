import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../redux/reducers';

/**
 * Redux Setting
 */

let middleware = [thunk];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middleware));


export {store};
