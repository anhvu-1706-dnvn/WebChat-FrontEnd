import {userActionTypes} from './actions';
export const initialState = {
  users: [],

  total: 0,

  
  loading: false,
  listUserSuccess: undefined,
  listUserFailure: undefined,

  createUserSuccess: undefined,
  createUserFailure: undefined,

  updateUserSuccess: undefined,
  updateUserFailure: undefined,


};
export default function (state = initialState, action) {
  switch (action.type) {
    case userActionTypes.GET_LIST_USER_ATTEMPT:
      return {
        ...state,
        loading: true,
      };
    case userActionTypes.GET_LIST_USER_SUCCESS:
      return {
        ...state,
        users: action.users,
        total: action.total,
        
        loading: false,
        listUserSuccess: true,
        listUserFailure: false,
      };
    case userActionTypes.GET_LIST_USER_FAILURE:
      return {
        ...state,
        loading: false,
        listUserSuccess: false,
        listUserFailure: action.getError,
      };
    case userActionTypes.CREATE_ONE_USER_ATTEMPT:
      return {
        ...state,
        loading: true,
      };
    case userActionTypes.CREATE_ONE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        createUserSuccess: true,
        createUserFailure: false,
      };
    case userActionTypes.CREATE_ONE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        createUserSuccess: false,
        createUserFailure: action.createError,
      };
    case userActionTypes.UPDATE_ONE_USER_ATTEMPT:
      return {
        ...state,
        loading: true,
      };
    case userActionTypes.UPDATE_ONE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        updateUserSuccess: true,
        updateUserFailure: false,
      };
    case userActionTypes.UPDATE_ONE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        updateUserSuccess: false,
        updateUserFailure: action.updateError,
      };
    case userActionTypes.SET_SEARCH_TEXT_SUCCESS:
      return {
        ...state,
        loading: false,
        searchText: {
          name: {$contL: action.text},
        },
        setSearchTextSuccess: true,
        setSearchTextFailure: false,
      };
    
    default:
      return state;
  }
}
