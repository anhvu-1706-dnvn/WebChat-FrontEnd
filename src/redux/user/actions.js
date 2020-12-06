import axios from "axios"
export const userActionTypes = {
  GET_LIST_USER_ATTEMPT: 'GET_LIST_USER_ATTEMPT',
  GET_LIST_USER_SUCCESS: 'GET_LIST_USER_SUCCESS',
  GET_LIST_USER_FAILURE: 'GET_LIST_USER_FAILURE',

  CREATE_ONE_USER_ATTEMPT: 'CREATE_ONE_USER_ATTEMPT',
  CREATE_ONE_USER_SUCCESS: 'CREATE_ONE_USER_SUCCESS',
  CREATE_ONE_USER_FAILURE: 'CREATE_ONE_USER_FAILURE',


  SET_SEARCH_TEXT_SUCCESS: 'SET_SEARCH_TEXT_SUCCESS',
  SET_SEARCH_TEXT_FAILURE: 'SET_SEARCH_TEXT_FAILURE',
};

// GET LIST UNIVERSITY
export function getListUserAttempt() {
  return {
    type: userActionTypes.GET_LIST_USER_ATTEMPT,
  };
}
export function getListUserSuccess(users, total) {
  return {
    type: userActionTypes.GET_LIST_USER_SUCCESS,
    users,
    total,
    // limit,
    // page,
    // pageCount,
  };
}
export function getListUserFailure(getError) {
  return {
    type: userActionTypes.GET_LIST_USER_FAILURE,
    getError,
  };
}
// CREATE USER
export function createUserAttempt() {
  return {
    type: userActionTypes.CREATE_ONE_USER_ATTEMPT,
  };
}
export function createUserSuccess() {
  return {
    type: userActionTypes.CREATE_ONE_USER_SUCCESS,
  };
}
export function createUserFailure(createError) {
  return {
    type: userActionTypes.CREATE_ONE_USER_FAILURE,
    createError,
  };
}


// Set search text

export function setSearchTextSuccess(text) {
  return {
    type: userActionTypes.SET_SEARCH_TEXT_SUCCESS,
    text,
  };
}
export function setSearchTextFailure(error) {
  return {
    type: userActionTypes.SET_SEARCH_TEXT_FAILURE,
    error,
  };
}
// THUNK :
export function getListUserExceptMe(token) {
  return async (dispatch) => {
    dispatch(getListUserAttempt());
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/user`, {token});
      dispatch(getListUserSuccess(res.data.users, res.data.total));
    } catch (error) {
      dispatch(getListUserFailure(error))
    }
  };
}