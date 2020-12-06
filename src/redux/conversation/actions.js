import axios from "axios"
export const conversationActionTypes = {
  GET_LIST_CONVERSATION_ATTEMPT: 'GET_LIST_CONVERSATION_ATTEMPT',
  GET_LIST_CONVERSATION_SUCCESS: 'GET_LIST_CONVERSATION_SUCCESS',
  GET_LIST_CONVERSATION_FAILURE: 'GET_LIST_CONVERSATION_FAILURE',

  CREATE_ONE_CONVERSATION_ATTEMPT: 'CREATE_ONE_CONVERSATION_ATTEMPT',
  CREATE_ONE_CONVERSATION_SUCCESS: 'CREATE_ONE_CONVERSATION_SUCCESS',
  CREATE_ONE_CONVERSATION_FAILURE: 'CREATE_ONE_CONVERSATION_FAILURE',

  UPDATE_ONE_CONVERSATION_ATTEMPT: 'UPDATE_ONE_CONVERSATION_ATTEMPT',
  UPDATE_ONE_CONVERSATION_SUCCESS: 'UPDATE_ONE_CONVERSATION_SUCCESS',
  UPDATE_ONE_CONVERSATION_FAILURE: 'UPDATE_ONE_CONVERSATION_FAILURE',

};

// GET LIST CONVERSATION
export function getListConversationAttempt() {
  return {
    type: conversationActionTypes.GET_LIST_CONVERSATION_ATTEMPT,
  };
}
export function getListConversationSuccess(conversation) {
  return {
    type: conversationActionTypes.GET_LIST_CONVERSATION_SUCCESS,
    conversation
    // limit,
    // page,
    // pageCount,
  };
}
export function getListConversationFailure(getError) {
  return {
    type: conversationActionTypes.GET_LIST_CONVERSATION_FAILURE,
    getError,
  };
}
// CREATE USER
export function createConversationAttempt() {
  return {
    type: conversationActionTypes.CREATE_ONE_CONVERSATION_ATTEMPT,
  };
}
export function createConversationSuccess() {
  return {
    type: conversationActionTypes.CREATE_ONE_CONVERSATION_SUCCESS,
  };
}
export function createConversationFailure(createError) {
  return {
    type: conversationActionTypes.CREATE_ONE_CONVERSATION_FAILURE,
    createError,
  };
}
// UPDATE UNIVERSITY
export function updateConversationAttempt() {
  return {
    type: conversationActionTypes.UPDATE_ONE_CONVERSATION_ATTEMPT,
  };
}
export function userConversationSuccess() {
  return {
    type: conversationActionTypes.UPDATE_ONE_CONVERSATION_SUCCESS,
  };
}
export function userConversationFailure(updateError) {
  return {
    type: conversationActionTypes.UPDATE_ONE_CONVERSATION_FAILURE,
    updateError,
  };
}


// THUNK :
export function getConversation(senderToken) {
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'token': senderToken
    }
  }
  return async (dispatch) => {
    dispatch(getListConversationAttempt());
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/conversation`, axiosConfig);
      const conversation = res.data.conversation;
      console.log('CON: ',conversation)
      dispatch(getListConversationSuccess(conversation));
    }catch(error) {
        console.error('err: ',error);
        dispatch(getListConversationFailure(error));
      };
  };
}
