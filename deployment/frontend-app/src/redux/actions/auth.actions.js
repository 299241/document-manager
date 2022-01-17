import authConstants from '../constants/auth.constants';
import authService from '../services/auth.service';

const authActions = {
  getUserAccount,
  userAccountChanged,
  setNoProvider
};

function getUserAccount() {
  return (dispatch) => {
    dispatch({ type: authConstants.GET_USER_ACCOUNT_REQUEST });
    authService
      .getUserAccount()
      .then((accounts) => {
        if (accounts.length === 0) {
          dispatch({ type: authConstants.GET_USER_ACCOUNT_ERROR });
        } else {
          dispatch({ type: authConstants.GET_USER_ACCOUNT_SUCCESS, account: accounts[0] });
        }
      })
      .catch((error) =>
        error.code === -32002
          ? dispatch({ type: authConstants.GET_USER_ACCOUNT_REQUEST })
          : dispatch({ type: authConstants.GET_USER_ACCOUNT_ERROR, error })
      );
  };
}

function userAccountChanged(account) {
  return { type: authConstants.GET_USER_ACCOUNT_SUCCESS, account: account.toLowerCase() };
}

function setNoProvider() {
  return { type: authConstants.GET_USER_ACCOUNT_ERROR, error: 'no_provider' };
}

export default authActions;
