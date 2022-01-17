import filesConstants from '../constants/files.constants';
import filesService from '../services/files.service';

const filesActions = {
  uploadFiles,
  downloadFile,
  clearFilesStore
};

function uploadFiles(files) {
  const cids = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    cids.push(filesService.addFile(file));
  }

  return (dispatch) => {
    dispatch({ type: filesConstants.UPLOAD_FILES_REQUEST });
    Promise.all(cids)
      .then((response) => {
        dispatch({ type: filesConstants.UPLOAD_FILES_SUCCESS, response });
      })
      .catch(() => {
        alert('Error: unable to upload files!');
        dispatch({ type: filesConstants.UPLOAD_FILES_ERROR });
      });
  };
}

function downloadFile(cid) {
  return (dispatch) => {
    dispatch({ type: filesConstants.DOWNLOAD_FILE_REQUEST });
    filesService
      .getFile(cid)
      .then((data) => {
        dispatch({ type: filesConstants.DOWNLOAD_FILE_SUCCESS, data });
      })
      .catch(() => dispatch({ type: filesConstants.DOWNLOAD_FILE_ERROR }));
  };
}

function clearFilesStore() {
  return { type: filesConstants.CLEAR_FILES_STORE };
}

export default filesActions;
