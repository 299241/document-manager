import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filter } from 'lodash';
// material
import { Card, Stack, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { DocumentList } from '../components/_document';
// redux
import documentsActions from '../redux/actions/documents.actions';

// ----------------------------------------------------------------------

function applyDraftsFilter(array) {
  return filter(array, (_document) => _document.status === 'EDITING');
}

export default function Drafts() {
  const dispatch = useDispatch();

  const getVaultDocumentsRequestStatus = useSelector(
    (state) => state.documentsStore.getVaultDocumentsRequestStatus
  );
  const vaultDocuments = useSelector((state) => state.documentsStore.vaultDocuments);

  const getVaultDocuments = () => {
    dispatch(documentsActions.getVaultDocuments());
  };

  useEffect(() => {
    getVaultDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Drafts">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Drafts
          </Typography>
        </Stack>

        <Card>
          {getVaultDocumentsRequestStatus === 'success' ? (
            <DocumentList
              documents={applyDraftsFilter(vaultDocuments)}
              showToolbar
              showPagination
            />
          ) : (
            <Stack sx={{ alignItems: 'center', pt: 6, pb: 6 }}>Loading...</Stack>
          )}
        </Card>
      </Container>
    </Page>
  );
}
