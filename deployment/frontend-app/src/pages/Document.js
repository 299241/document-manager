import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// material
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Stack,
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
// icons
import { Icon } from '@iconify/react';
import editIcon from '@iconify/icons-eva/edit-2-fill';
import fileIcon from '@iconify/icons-eva/file-fill';
import peopleIcon from '@iconify/icons-eva/people-fill';
import closeIcon from '@iconify/icons-eva/close-fill';
import personIcon from '@iconify/icons-eva/person-fill';
import personDoneIcon from '@iconify/icons-eva/person-done-fill';
// components
import Page from '../components/Page';
import { DocumentKeyForm, EventsTimeline } from '../components/_document';
import { DocumentNameForm, DocumentSignersList } from '../components/_newdocument';
// redux
import filesActions from '../redux/actions/files.actions';
import documentsActions from '../redux/actions/documents.actions';
import usePrevious from '../utils/hooks/usePrevious';
import aesHelper from '../utils/aesHelper';

// ----------------------------------------------------------------------

export default function Document() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const hash = location.pathname.split('/')[2];
  const [nameFormDialogOpened, setNameFormDialogOpened] = useState(false);
  const [signersDialogOpened, setSignersDialogOpened] = useState(false);
  const [encryptionDialogOpened, setEncryptionDialogOpened] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [firstRender, setFirstRender] = useState(false);

  const userAccount = useSelector((state) => state.authStore.userAccount);
  const getDocumentRequestStatus = useSelector(
    (state) => state.documentsStore.getDocumentRequestStatus
  );
  const document = useSelector((state) => state.documentsStore.document);
  const getAllDocumentEventsRequestStatus = useSelector(
    (state) => state.documentsStore.getAllDocumentEventsRequestStatus
  );
  const events = useSelector((state) => state.documentsStore.documentEvents);
  const downloadFileRequestStatus = useSelector(
    (state) => state.filesStore.downloadFileRequestStatus
  );
  const fileData = useSelector((state) => state.filesStore.fileData);
  const changeNameRequestStatus = useSelector(
    (state) => state.documentsStore.changeNameRequestStatus
  );
  const updateSignersRequestStatus = useSelector(
    (state) => state.documentsStore.updateSignersRequestStatus
  );
  const signDocumentRequestStatus = useSelector(
    (state) => state.documentsStore.signDocumentRequestStatus
  );
  const sendDocumentRequestStatus = useSelector(
    (state) => state.documentsStore.sendDocumentRequestStatus
  );

  const prevState = usePrevious({
    userAccount,
    getDocumentRequestStatus,
    downloadFileRequestStatus,
    changeNameRequestStatus,
    updateSignersRequestStatus,
    signDocumentRequestStatus,
    sendDocumentRequestStatus
  });

  const getFile = (cid) => {
    dispatch(filesActions.downloadFile(cid));
  };

  const documentOpened = () => {
    dispatch(documentsActions.documentOpened(hash));
  };

  const getDocumentData = () => {
    if (getDocumentRequestStatus !== 'pending' && getAllDocumentEventsRequestStatus !== 'pending') {
      dispatch(documentsActions.getDocument(hash));
      dispatch(documentsActions.getAllDocumentEvents(hash));
    }
  };

  const changeDocumentName = (newName) => {
    dispatch(documentsActions.changeDocumentName(hash, newName));
  };

  const signDocument = () => {
    dispatch(documentsActions.signDocument(hash));
  };

  const sendDocument = () => {
    dispatch(documentsActions.sendDocument(hash));
  };

  const updateSigners = (newSigners, importantOrder) => {
    dispatch(documentsActions.updateSigners(hash, newSigners, importantOrder));
  };

  const prepareDownloadBlob = (key) => {
    try {
      const data = key ? aesHelper.decrypt(fileData, key) : fileData;
      const decoded = JSON.parse(data);
      fetch(decoded.data)
        .then((resp) => resp.blob())
        .then((blob) => {
          if (encryptionDialogOpened) {
            setEncryptionDialogOpened(false);
          }
          const url = window.URL.createObjectURL(blob);
          const link = window.document.createElement('a');
          link.href = url;
          link.download = decoded.filename;
          link.click();
          link.remove();
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            dispatch(filesActions.clearFilesStore());
          }, 100);
        });
    } catch (error) {
      if (encryptionDialogOpened) {
        setEncryptionDialogOpened(false);
      }
      alert(
        'Error: unable to read data. It is possible that the decryption key entered is incorrect.'
      );
    }
  };

  useEffect(() => {
    if (prevState?.userAccount !== userAccount && userAccount !== null) {
      getDocumentData();
      documentOpened();
      setFirstRender(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccount]);

  useEffect(() => {
    if (prevState?.getDocumentRequestStatus === 'pending') {
      if (getDocumentRequestStatus === 'error') {
        alert("Error: document with this hash doesn't exist");
        navigate(`/dashboard`, { replace: true });
      } else if (getDocumentRequestStatus === 'success') {
        setIsAuthor(document[3] === userAccount);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDocumentRequestStatus]);

  useEffect(() => {
    if (
      prevState?.downloadFileRequestStatus === 'pending' &&
      downloadFileRequestStatus === 'success'
    ) {
      // encryption
      if (document[10]) {
        setEncryptionDialogOpened(true);
      } else {
        prepareDownloadBlob();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadFileRequestStatus]);

  useEffect(() => {
    if (firstRender && prevState?.changeNameRequestStatus === 'pending') {
      if (changeNameRequestStatus === 'success') {
        getDocumentData();
        setNameFormDialogOpened(false);
      } else if (changeNameRequestStatus === 'error') {
        setNameFormDialogOpened(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeNameRequestStatus]);

  useEffect(() => {
    if (firstRender && prevState?.updateSignersRequestStatus === 'pending') {
      if (updateSignersRequestStatus === 'success') {
        getDocumentData();
        setSignersDialogOpened(false);
      } else if (changeNameRequestStatus === 'error') {
        setSignersDialogOpened(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSignersRequestStatus]);

  useEffect(() => {
    if (
      firstRender &&
      prevState?.signDocumentRequestStatus === 'pending' &&
      signDocumentRequestStatus === 'success'
    ) {
      getDocumentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signDocumentRequestStatus]);

  useEffect(() => {
    if (
      firstRender &&
      prevState?.sendDocumentRequestStatus === 'pending' &&
      sendDocumentRequestStatus === 'success'
    ) {
      getDocumentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendDocumentRequestStatus]);

  return (
    getDocumentRequestStatus === 'success' && (
      <Page title={document[4]}>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h4" gutterBottom>
                {document[4]}
              </Typography>
              {isAuthor && (
                <IconButton onClick={() => setNameFormDialogOpened(true)}>
                  <Icon icon={editIcon} />
                </IconButton>
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              {isAuthor && document[6] === '0' && (
                <LoadingButton
                  variant="outlined"
                  loading={sendDocumentRequestStatus === 'pending'}
                  onClick={() => sendDocument()}
                >
                  Send document
                </LoadingButton>
              )}
              {document[5].includes(userAccount) && !document[9].includes(userAccount) && (
                <LoadingButton
                  variant="outlined"
                  color="success"
                  loading={signDocumentRequestStatus === 'pending'}
                  onClick={() => signDocument()}
                  disabled={
                    document[6] === '0' ||
                    (document[2]
                      ? document[5].indexOf(userAccount).toString() !== document[1].toString()
                      : false)
                  }
                >
                  Sign document
                </LoadingButton>
              )}
            </Stack>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={8}>
                  <Card>
                    <CardHeader title="Author" />
                    <CardContent>{document[3]}</CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <Card>
                    <CardHeader title="Creation date" />
                    <CardContent>{new Date(document[7]).toLocaleString()}</CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12} lg={8}>
                  <Card>
                    <CardHeader title="Document hash" />
                    <CardContent
                      sx={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis ellipsis'
                      }}
                    >
                      {hash}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <Card>
                    <CardHeader title="Block number" />
                    <CardContent>{document[0]}</CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Card>
                    <CardHeader title="Files" />
                    <List>
                      {document[8].map((item) => (
                        <ListItem key={item} disablePadding>
                          <ListItemButton onClick={() => getFile(item)}>
                            <ListItemIcon sx={{ pl: '6px' }}>
                              <Icon icon={fileIcon} height={24} />
                            </ListItemIcon>
                            <ListItemText>{item}</ListItemText>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Card>
                    <CardHeader
                      title={
                        <>
                          <Stack direction="row" justifyContent="space-between">
                            Signers
                            {document[6] === '0' && isAuthor && (
                              <Button
                                variant="text"
                                startIcon={<Icon icon={peopleIcon} />}
                                onClick={() => setSignersDialogOpened(true)}
                              >
                                Edit signers
                              </Button>
                            )}
                          </Stack>
                        </>
                      }
                      subheader={`The order of signers is ${document[2] ? '' : 'not'} important`}
                    />
                    <CardContent>
                      <List>
                        {document[5].map((item) => (
                          <ListItem key={item} sx={{ mb: '12px' }} disablePadding>
                            <ListItemIcon sx={{ pl: '6px' }}>
                              <Icon
                                icon={document[9].includes(item) ? personDoneIcon : personIcon}
                                height={24}
                                color={
                                  document[9].includes(item)
                                    ? theme.palette.success.main
                                    : theme.palette.grey[800]
                                }
                              />
                            </ListItemIcon>
                            <ListItemText>{item}</ListItemText>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <EventsTimeline events={events} />
            </Grid>
          </Grid>
        </Container>
        {isAuthor && (
          <Dialog fullWidth open={nameFormDialogOpened}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={() => setNameFormDialogOpened(false)}>
                <Icon icon={closeIcon} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack>
                <DocumentNameForm
                  onFormSubmit={(data) => changeDocumentName(data.documentName)}
                  prevName={document[4]}
                />
              </Stack>
            </DialogContent>
          </Dialog>
        )}
        {document[6] === '0' && (
          <Dialog fullWidth open={signersDialogOpened}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={() => setSignersDialogOpened(false)}>
                <Icon icon={closeIcon} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack>
                <DocumentSignersList
                  actualSigners={document[5]}
                  signersOrderImportant={document[2]}
                  onSignersUpdate={(signers, importantOrder) =>
                    updateSigners(signers, importantOrder)
                  }
                />
              </Stack>
            </DialogContent>
          </Dialog>
        )}
        {document[10] && (
          <Dialog fullWidth open={encryptionDialogOpened}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={() => setEncryptionDialogOpened(false)}>
                <Icon icon={closeIcon} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DocumentKeyForm onFormSubmit={(data) => prepareDownloadBlob(data.password)} />
            </DialogContent>
          </Dialog>
        )}
      </Page>
    )
  );
}
