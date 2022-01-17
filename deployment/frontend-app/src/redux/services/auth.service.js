const authService = {
  getUserAccount
};

function getUserAccount() {
  return window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => accounts);
}

export default authService;
