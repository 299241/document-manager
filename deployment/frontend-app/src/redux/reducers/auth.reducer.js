import authConstants from '../constants/auth.constants';

const initialState = {
  userAccount: null,
  userAccountRequestStatus: 'idle',
  userAccountRequestError: null
};

function auth(state = initialState, action) {
  switch (action.type) {
    case authConstants.GET_USER_ACCOUNT_REQUEST:
      return {
        ...state,
        userAccountRequestStatus: 'pending'
      };
    case authConstants.GET_USER_ACCOUNT_SUCCESS:
      return {
        ...state,
        userAccountRequestStatus: 'success',
        userAccount: action.account
      };
    case authConstants.GET_USER_ACCOUNT_ERROR:
      return {
        ...state,
        userAccountRequestStatus: 'error',
        userAccountRequestError: action.error
      };
    default:
      return state;
  }
}

export default auth;
