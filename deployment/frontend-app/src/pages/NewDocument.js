import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// material
import { styled } from '@mui/material/styles';
import { Container, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
// components
import {
  DocumentAwaiting,
  DocumentFilesDropzone,
  DocumentFilesList,
  DocumentNameForm,
  DocumentSignersList
} from '../components/_newdocument';
import Page from '../components/Page';
import AuthLayout from '../layouts/AuthLayout';
import { toBase64 } from '../utils/toBase64';
import aesHelper from '../utils/aesHelper';
// redux
import filesActions from '../redux/actions/files.actions';
import documentsActions from '../redux/actions/documents.actions';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function NewDocument() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const uploadFilesRequestStatus = useSelector(
    (state) => state.filesStore.uploadFilesRequestStatus
  );
  const cids = useSelector((state) => state.filesStore.cids);
  const createDocumentRequestStatus = useSelector(
    (state) => state.documentsStore.createDocumentRequestStatus
  );
  const documentHash = useSelector((state) => state.documentsStore.documentHash);

  const uploadFiles = async () => {
    dispatch(filesActions.uploadFiles(await prepareFiles()));
  };

  const createDocument = () => {
    dispatch(
      documentsActions.createDocument(
        documentName,
        documentSigners,
        documentFiles,
        cids,
        documentSignersOrderImportant,
        password.length > 0
      )
    );
  };

  const [step, setStep] = useState(0);
  const [documentName, setDocumentName] = useState('');
  const [documentFiles, setDocumentFiles] = useState([]);
  const [documentSigners, setDocumentSigners] = useState([]);
  const [documentSignersOrderImportant, setDocumetSignerOrderImportant] = useState(false);
  const [password, setPassword] = useState('');

  const prepareFiles = async () => {
    const files = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const file of documentFiles) {
      // eslint-disable-next-line no-await-in-loop
      const base = await toBase64(file);
      let data = JSON.stringify({ filename: file.name, data: base });
      if (password.length > 0) {
        data = aesHelper.encrypt(data, password);
      }
      files.push(data);
    }
    return files;
  };

  useEffect(() => {
    dispatch(filesActions.clearFilesStore());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (uploadFilesRequestStatus === 'success') {
      createDocument();
    } else if (uploadFilesRequestStatus === 'error') {
      navigate(`/dashbord`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadFilesRequestStatus]);

  useEffect(() => {
    if (createDocumentRequestStatus === 'success') {
      navigate(`/document/${documentHash}`, { replace: true });
    } else if (createDocumentRequestStatus === 'error') {
      alert('Error: unable to add document to blockchain!');
      navigate(`/dashbord`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDocumentRequestStatus, navigate]);

  useEffect(() => {
    dispatch(filesActions.clearFilesStore());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <DocumentNameForm
            onFormSubmit={(props) => {
              setDocumentName(props.documentName);
              setStep(1);
            }}
          />
        );
      case 1:
        return (
          <DocumentFilesDropzone
            onFilesSubmit={(files) => {
              setDocumentFiles(documentFiles.concat(files));
              setStep(2);
            }}
          />
        );
      case 2:
        return (
          <DocumentFilesList
            files={documentFiles}
            onFileAdd={() => setStep(1)}
            onFileDelete={(deleteIndex) =>
              setDocumentFiles(documentFiles.filter((item, index) => index !== deleteIndex))
            }
            onListAccepted={(password) => {
              setPassword(password);
              setStep(3);
            }}
          />
        );
      case 3:
        return (
          <DocumentSignersList
            actualSigners={documentSigners}
            signersOrderImportant={documentSignersOrderImportant}
            onSignersUpdate={async (signers, importantOrder) => {
              setDocumentSigners(signers);
              setDocumetSignerOrderImportant(importantOrder);
              setStep(4);
              uploadFiles();
            }}
          />
        );
      case 4:
        return <DocumentAwaiting />;

      default:
        return <DocumentNameForm onFormSubmit={(props) => setDocumentName(props.documentName)} />;
    }
  };

  return (
    <RootStyle title="New document">
      <AuthLayout>
        <IconButton onClick={() => navigate('/dashboard', { replace: true })}>
          <Icon icon={closeFill} />
        </IconButton>
      </AuthLayout>
      <Container maxWidth="sm">{renderStep()}</Container>
    </RootStyle>
  );
}

NewDocument.propTypes = {
  documentName: PropTypes.string
};
