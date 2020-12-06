export const authActionTypes = {
  LOGIN_ATTEMPT: 'LOGIN_ATTEMPT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
};
export function LoginLoading() {
  return {
    type: authActionTypes.LOGIN_ATTEMPT,
  };
}
export function LoginSuccess(data) {
  return {
    type: authActionTypes.LOGIN_SUCCESS,
    data,
  };
}
export function LoginFailure(loginError) {
  return {
    type: authActionTypes.LOGIN_FAIL,
    loginError,
  };
}
export function LogoutSuccess() {
  return {
    type: authActionTypes.LOGOUT,
  };
}
export function Login(userValues) {
  return (dispatch) => {
    dispatch(LoginLoading());
    console.log('REQUEST API ');
    return fetch(`${process.env.REACT_APP_API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        // these could be different for your API call
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userValues),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('JSON', json);
        const res = json;
        if (res.token) {
          // response success checking logic could differ
          console.log('SUCCESSFULLY');
          localStorage.setItem('token', res.token);
          localStorage.setItem('name', res.name);
          localStorage.setItem('email', res.email);
          dispatch(LoginSuccess(res)); // our action is called here
        } else {
          console.log('FAIL');
          dispatch(LoginFailure(res));
        }
      })
      .catch((err) => {
        console.log('ABC', err);
        dispatch(LoginFailure(err));
      });
  };
}
export function Logout(history) {
  return (dispatch) => {
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    history.push('/login')
    dispatch(LogoutSuccess());
    return;
  };
}
