import documentsConstants from '../constants/documents.constants';

const initialState = {
  createDocumentRequestStatus: 'idle',
  changeNameRequestStatus: 'idle',
  updateSignersRequestStatus: 'idle',
  sendDocumentRequestStatus: 'idle',
  signDocumentRequestStatus: 'idle',
  getStatusRequestStatus: 'idle',
  getDocumentRequestStatus: 'idle',
  getAllDocumentEventsRequestStatus: 'idle',
  getVaultDocumentsRequestStatus: 'idle',
  documentOpenedRequestStatus: 'idle',
  documentHash: null,
  documentStatus: null,
  document: null,
  documentEvents: [],
  vaultDocuments: []
};

function documents(state = initialState, action) {
  switch (action.type) {
    case documentsConstants.CREATE_DOCUMENT_REQUEST:
      return {
        ...state,
        createDocumentRequestStatus: 'pending'
      };
    case documentsConstants.CREATE_DOCUMENT_SUCCESS:
      return {
        ...state,
        createDocumentRequestStatus: 'success',
        documentHash: action.hash
      };
    case documentsConstants.CREATE_DOCUMENT_ERROR:
      return {
        ...state,
        createDocumentRequestStatus: 'error'
      };
    case documentsConstants.CHANGE_NAME_REQUEST:
      return {
        ...state,
        changeNameRequestStatus: 'pending'
      };
    case documentsConstants.CHANGE_NAME_SUCCESS:
      return {
        ...state,
        changeNameRequestStatus: 'success'
      };
    case documentsConstants.CHANGE_NAME_ERROR:
      return {
        ...state,
        changeNameRequestStatus: 'error'
      };
    case documentsConstants.UPDATE_SIGNERS_REQUEST:
      return {
        ...state,
        updateSignersRequestStatus: 'pending'
      };
    case documentsConstants.UPDATE_SIGNERS_SUCCESS:
      return {
        ...state,
        updateSignersRequestStatus: 'success'
      };
    case documentsConstants.UPDATE_SIGNERS_ERROR:
      return {
        ...state,
        updateSignersRequestStatus: 'error'
      };
    case documentsConstants.SEND_DOCUMENT_REQUEST:
      return {
        ...state,
        sendDocumentRequestStatus: 'pending'
      };
    case documentsConstants.SEND_DOCUMENT_SUCCESS:
      return {
        ...state,
        sendDocumentRequestStatus: 'success'
      };
    case documentsConstants.SEND_DOCUMENT_ERROR:
      return {
        ...state,
        sendDocumentRequestStatus: 'error'
      };
    case documentsConstants.SIGN_DOCUMENT_REQUEST:
      return {
        ...state,
        signDocumentRequestStatus: 'pending'
      };
    case documentsConstants.SIGN_DOCUMENT_SUCCESS:
      return {
        ...state,
        signDocumentRequestStatus: 'success'
      };
    case documentsConstants.SIGN_DOCUMENT_ERROR:
      return {
        ...state,
        signDocumentRequestStatus: 'error'
      };
    case documentsConstants.GET_STATUS_REQUEST:
      return {
        ...state,
        getStatusRequestStatus: 'pending'
      };
    case documentsConstants.GET_STATUS_SUCCESS:
      return {
        ...state,
        getStatusRequestStatus: 'success',
        documentStatus: action.status
      };
    case documentsConstants.GET_STATUS_ERROR:
      return {
        ...state,
        getStatusRequestStatus: 'error'
      };
    case documentsConstants.GET_DOCUMENT_REQUEST:
      return {
        ...state,
        getDocumentRequestStatus: 'pending'
      };
    case documentsConstants.GET_DOCUMENT_SUCCESS:
      return {
        ...state,
        getDocumentRequestStatus: 'success',
        document: action.document
      };
    case documentsConstants.GET_DOCUMENT_ERROR:
      return {
        ...state,
        getDocumentRequestStatus: 'error'
      };
    case documentsConstants.GET_ALL_DOCUMENT_EVENTS_REQUEST:
      return {
        ...state,
        getAllDocumentEventsRequestStatus: 'pending'
      };
    case documentsConstants.GET_ALL_DOCUMENT_EVENTS_SUCCESS:
      return {
        ...state,
        getAllDocumentEventsRequestStatus: 'success',
        documentEvents: action.eventsWithDates
      };
    case documentsConstants.GET_ALL_DOCUMENT_EVENTS_ERROR:
      return {
        ...state,
        getAllDocumentEventsRequestStatus: 'error'
      };
    case documentsConstants.GET_VAULT_DOCUMENTS_REQUEST:
      return {
        ...state,
        getVaultDocumentsRequestStatus: 'pending'
      };
    case documentsConstants.GET_VAULT_DOCUMENTS_SUCCESS:
      return {
        ...state,
        getVaultDocumentsRequestStatus: 'success',
        vaultDocuments: action.documents
      };
    case documentsConstants.GET_VAULT_DOCUMENTS_ERROR:
      return {
        ...state,
        getVaultDocumentsRequestStatus: 'error'
      };
    case documentsConstants.DOCUMENT_OPENED_REQUEST:
      return {
        ...state,
        documentOpenedRequestStatus: 'pending'
      };
    case documentsConstants.DOCUMENT_OPENED_SUCCESS:
      return {
        ...state,
        documentOpenedRequestStatus: 'success'
      };
    case documentsConstants.DOCUMENT_OPENED_ERROR:
      return {
        ...state,
        documentOpenedRequestStatus: 'error'
      };
    case documentsConstants.CLEAR_DOCUMENT_STORE:
      return {
        ...state,
        changeNameRequestStatus: 'idle',
        updateSignersRequestStatus: 'idle',
        sendDocumentRequestStatus: 'idle',
        signDocumentRequestStatus: 'idle',
        getStatusRequestStatus: 'idle'
      };
    case documentsConstants.CLEAR_DOCUMENTS_STORE:
      return {
        ...initialState
      };
    default:
      return state;
  }
}

export default documents;
