import {conversationActionTypes} from './actions';
export const initialState = {
  conversation: [],
  loading: false,
  listConversationSuccess: undefined,
  listConversationFailure: undefined,

  createConversationSuccess: undefined,
  createConversationFailure: undefined,

  updateConversationSuccess: undefined,
  updateConversationFailure: undefined,


};
export default function (state = initialState, action) {
  switch (action.type) {
    case conversationActionTypes.GET_LIST_CONVERSATION_ATTEMPT:
      return {
        ...state,
        loading: true,
      };
    case conversationActionTypes.GET_LIST_CONVERSATION_SUCCESS:
      return {
        ...state,
        conversation: action.conversation,
        loading: false,
        listConversationSuccess: true,
        listConversationFailure: false,
      };
    case conversationActionTypes.GET_LIST_CONVERSATION_FAILURE:
      return {
        ...state,
        loading: false,
        listConversationSuccess: false,
        listConversationFailure: action.getError,
      };
    case conversationActionTypes.CREATE_ONE_CONVERSATION_ATTEMPT:
      return {
        ...state,
        loading: true,
      };
    case conversationActionTypes.CREATE_ONE_CONVERSATION_SUCCESS:
      return {
        ...state,
        loading: false,
        createConversationSuccess: true,
        createConversationFailure: false,
      };
    case conversationActionTypes.CREATE_ONE_CONVERSATION_FAILURE:
      return {
        ...state,
        loading: false,
        createConversationSuccess: false,
        createConversationFailure: action.createError,
      };
    case conversationActionTypes.UPDATE_ONE_CONVERSATION_ATTEMPT:
      return {
        ...state,
        loading: true,
      };
    case conversationActionTypes.UPDATE_ONE_CONVERSATION_SUCCESS:
      return {
        ...state,
        loading: false,
        updateConversationSuccess: true,
        updateConversationFailure: false,
      };
    case conversationActionTypes.UPDATE_ONE_CONVERSATION_FAILURE:
      return {
        ...state,
        loading: false,
        updateConversationSuccess: false,
        updateConversationFailure: action.updateError,
      };
    
    default:
      return state;
  }
}
