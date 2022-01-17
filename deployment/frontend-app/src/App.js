import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import detectEthereumProvider from '@metamask/detect-provider';
// material
import { Backdrop, CircularProgress } from '@mui/material';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
// redux
import authActions from './redux/actions/auth.actions';

// ----------------------------------------------------------------------

export default function App() {
  const [isLoading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentAccount = useSelector((state) => state.authStore.userAccount);

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
      navigate('/login');
    } else if (accounts[0] !== currentAccount) {
      /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
      dispatch(authActions.userAccountChanged(accounts[0]));
      navigate(window.location.pathname);
    }
  }

  useEffect(() => {
    async function init() {
      const provider = await detectEthereumProvider();
      setLoading(false);

      if (provider) {
        window.ethereum
          .request({ method: 'eth_accounts' })
          .then(handleAccountsChanged)
          .catch((err) => {
            console.error(err);
          });
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      } else {
        dispatch(authActions.setNoProvider());
        navigate('/login');
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeConfig>
      <Backdrop
        sx={{ background: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <ScrollToTop />
      <GlobalStyles />
      <Router />
    </ThemeConfig>
  );
}
