import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container, Card, CardContent, Stack } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import authActions from '../redux/actions/auth.actions';
import usePrevious from '../utils/hooks/usePrevious';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userAccountRequestStatus = useSelector((state) => state.authStore.userAccountRequestStatus);
  const userAccountRequestError = useSelector((state) => state.authStore.userAccountRequestError);

  const isAccountPending = userAccountRequestStatus === 'pending';
  const isNoProvider = userAccountRequestError === 'no_provider';

  const prevState = usePrevious({
    userAccountRequestStatus
  });

  const handleMetaMask = () => {
    dispatch(authActions.getUserAccount());
  };

  useEffect(() => {
    if (
      prevState?.userAccountRequestStatus === 'pending' &&
      userAccountRequestStatus === 'success'
    ) {
      navigate('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccountRequestStatus]);

  return (
    <RootStyle title="Login">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Sign in to Document Manager
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Connect your wallet to start using Document Manager
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box sx={{ mx: 'auto', my: { xs: 5, sm: 10 } }}>
                <Card>
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ height: 60 }}
                    >
                      <img
                        style={{ height: 200 }}
                        alt="metamask"
                        src="/static/icons/metamask-fox.svg"
                      />
                      <Stack alignItems="center">
                        <Button
                          onClick={handleMetaMask}
                          variant="contained"
                          color="warning"
                          disabled={isAccountPending || isNoProvider}
                        >
                          Connect to MetaMask
                        </Button>
                        {isNoProvider && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'error.main', marginTop: 0.5 }}
                          >
                            No browser wallet detected.
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
