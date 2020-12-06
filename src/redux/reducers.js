import {combineReducers} from 'redux';
import AuthReducer from './auth/reducer';
import UserReducer from './user/reducer';
import ConversationReducer from './conversation/reducer'
export default combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  conversation: ConversationReducer,
});
