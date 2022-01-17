import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// material
import { Box, Card, Stack, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { DocumentList } from '../components/_document';
// redux
import documentsActions from '../redux/actions/documents.actions';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const dispatch = useDispatch();

  const userAccount = useSelector((state) => state.authStore.userAccount);
  const getVaultDocumentsRequestStatus = useSelector(
    (state) => state.documentsStore.getVaultDocumentsRequestStatus
  );
  const vaultDocuments = useSelector((state) => state.documentsStore.vaultDocuments);

  const getVaultDocuments = () => {
    dispatch(documentsActions.getVaultDocuments(true));
  };

  useEffect(() => {
    if (userAccount !== null) {
      getVaultDocuments(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccount]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h3">Hi, Welcome back</Typography>
        </Box>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4" gutterBottom>
            Need your signature
          </Typography>
          <Card>
            {getVaultDocumentsRequestStatus === 'success' ? (
              <DocumentList
                documents={vaultDocuments.filter(
                  (x) =>
                    x.status === 'SIGNING' &&
                    !x.signed.includes(userAccount) &&
                    x.signers.includes(userAccount)
                )}
                showToolbar={false}
                showPagination
              />
            ) : (
              <Stack sx={{ alignItems: 'center', pt: 6, pb: 6 }}>Loading...</Stack>
            )}
          </Card>
        </Box>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4" gutterBottom>
            Recent
          </Typography>
          <Card>
            {getVaultDocumentsRequestStatus === 'success' ? (
              <DocumentList
                documents={vaultDocuments
                  .sort((x, y) => x.date - y.date)
                  .slice(0)
                  .slice(-3)}
                showToolbar={false}
                showPagination={false}
              />
            ) : (
              <Stack sx={{ alignItems: 'center', pt: 6, pb: 6 }}>Loading...</Stack>
            )}
          </Card>
        </Box>
      </Container>
    </Page>
  );
}
