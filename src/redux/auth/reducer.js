import {authActionTypes} from './actions';
const _INITIAL_STATE_ = {
  isAuthenticated: false,
  data: {
    token: localStorage.getItem('token'),
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
  },
  isLoading: false,
  loginError: false,
  loginSuccess: false,
};
export default function (state = _INITIAL_STATE_, action) {
  switch (action.type) {
    case authActionTypes.LOGIN_ATTEMPT:
      return {
        ...state,
        isLoading: true,
      };
    case authActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        data: {
          token: action.data.token,
          name: action.data.name,
          email: action.data.email
        },
        isLoading: false,
        loginSuccess: true,
        loginError: false,
      };
    case authActionTypes.LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        loginSuccess: false,
        loginError: action.loginError,
      };
    case authActionTypes.LOGOUT:
      return {
        ...state,
        data: {},
        isAuthenticated: false,
        loginError: false,
        loginSuccess: false,
      };
    default:
      return state;
  }
}
