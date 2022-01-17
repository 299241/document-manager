import filesConstants from '../constants/files.constants';

const initialState = {
  cids: null,
  uploadFilesRequestStatus: 'idle',
  downloadFileRequestStatus: 'idle'
};

function files(state = initialState, action) {
  switch (action.type) {
    case filesConstants.UPLOAD_FILES_REQUEST:
      return {
        ...state,
        uploadFilesRequestStatus: 'pending'
      };
    case filesConstants.UPLOAD_FILES_SUCCESS:
      return {
        ...state,
        uploadFilesRequestStatus: 'success',
        cids: action.response
      };
    case filesConstants.UPLOAD_FILES_ERROR:
      return {
        ...state,
        uploadFilesRequestStatus: 'error'
      };
    case filesConstants.DOWNLOAD_FILE_REQUEST:
      return {
        ...state,
        downloadFileRequestStatus: 'pending'
      };
    case filesConstants.DOWNLOAD_FILE_SUCCESS:
      return {
        ...state,
        downloadFileRequestStatus: 'success',
        fileData: action.data
      };
    case filesConstants.DOWNLOAD_FILE_ERROR:
      return {
        ...state,
        downloadFileRequestStatus: 'error'
      };
    case filesConstants.CLEAR_FILES_STORE:
      return {
        ...initialState
      };
    default:
      return state;
  }
}

export default files;
