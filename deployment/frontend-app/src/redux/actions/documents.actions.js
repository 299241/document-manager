import crypto from 'crypto';
import {
  getBytes32FromMultihash,
  getMultihashFromContractResponse
} from '../../utils/multihashHelper';

import documentsConstants from '../constants/documents.constants';
import documentsService from '../services/documents.service';
import store from '../store';

const documentsActions = {
  createDocument,
  getDocument,
  getAllDocumentEvents,
  changeDocumentName,
  updateSigners,
  signDocument,
  sendDocument,
  getVaultDocuments,
  documentOpened,
  clearDocumentsStore
};

function createDocument(name, signers, files, cids, importantOrder, filesEncypted) {
  const hashes = [];
  const multihashes = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    hashes.push(hashFile(file));
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const cid of cids) {
    multihashes.push(getBytes32FromMultihash(cid.toString()));
  }

  return (dispatch) => {
    dispatch({ type: documentsConstants.CREATE_DOCUMENT_REQUEST });
    Promise.all(hashes).then(() => {
      const hash = hashMsg(Date.now() + hashes.sort().toString());
      documentsService
        .create(
          hash,
          name,
          signers,
          multihashes,
          importantOrder,
          filesEncypted,
          store.getState().authStore.userAccount
        )
        .then(() => {
          dispatch({ type: documentsConstants.CREATE_DOCUMENT_SUCCESS, hash });
        })
        .catch((err) => {
          alert(`Error: ${err}`);
          dispatch({ type: documentsConstants.CREATE_DOCUMENT_ERROR });
        });
    });
  };
}

function getDocument(hash) {
  const cids = [];
  const signed = [];
  return (dispatch) => {
    dispatch({ type: documentsConstants.GET_DOCUMENT_REQUEST });
    documentsService
      .get(hash)
      .then(async (document) => {
        const timestamp = await documentsService.getBlockTimestamp(document[0]);
        const createdEvent = await documentsService.getPastEvents('DocumentCreated', {
          _hash: hash
        });
        const files = createdEvent[0].returnValues[7];
        // eslint-disable-next-line no-restricted-syntax
        for (const f of files) {
          cids.push(getMultihashFromContractResponse(f));
        }
        const signedEvents = await documentsService.getPastEvents('DocumentSigned', {
          _hash: hash
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const s of signedEvents) {
          signed.push(s.returnValues[1].toLowerCase());
        }
        document[3] = document[3].toLowerCase();
        document[5] = document[5].map((item) => item.toLowerCase());
        document[7] = timestamp * 1000;
        document[8] = cids;
        document[9] = signed;
        document[10] = createdEvent[0].returnValues['4'];
        document[11] = createdEvent.concat();
        dispatch({ type: documentsConstants.GET_DOCUMENT_SUCCESS, document });
      })
      .catch((e) => {
        console.log(e.toString());
        dispatch({ type: documentsConstants.GET_DOCUMENT_ERROR });
      });
  };
}

function getAllDocumentEvents(hash) {
  const eventTypes = [
    'DocumentSigned',
    'DocumentOpened',
    'DocumentNameChanged',
    'DocumentSignersUpdated',
    'DocumentSent'
  ];

  return (dispatch) => {
    dispatch({ type: documentsConstants.GET_ALL_DOCUMENT_EVENTS_REQUEST });

    documentsService
      .getPastEvents('DocumentCreated', { _hash: hash })
      .then(async (events) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const e of eventTypes) {
          events = events.concat(
            // eslint-disable-next-line no-await-in-loop
            await documentsService.getPastEvents(e, { _hash: hash })
          );
        }
        const eventsWithDates = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const e of events) {
          // eslint-disable-next-line no-await-in-loop
          const timestamp = await documentsService.getBlockTimestamp(e.blockNumber);
          e.timestamp = timestamp * 1000;
          eventsWithDates.push(e);
        }
        eventsWithDates.sort((x, y) => y.blockNumber - x.blockNumber);
        dispatch({ type: documentsConstants.GET_ALL_DOCUMENT_EVENTS_SUCCESS, eventsWithDates });
      })
      .catch((e) => {
        console.log(e.toString());
        dispatch({ type: documentsConstants.GET_ALL_DOCUMENT_EVENTS_ERROR });
      });
  };
}

function changeDocumentName(hash, newName) {
  return (dispatch) => {
    dispatch({ type: documentsConstants.CHANGE_NAME_REQUEST });
    documentsService
      .changeName(hash, newName, store.getState().authStore.userAccount)
      .then(() => {
        dispatch({ type: documentsConstants.CHANGE_NAME_SUCCESS });
      })
      .catch((e) => {
        console.log(e.toString());
        alert("Error: couldn't change document's name!");
        dispatch({ type: documentsConstants.CHANGE_NAME_ERROR });
      });
  };
}

function updateSigners(hash, newSigners, importantOrder) {
  return (dispatch) => {
    dispatch({ type: documentsConstants.UPDATE_SIGNERS_REQUEST });
    documentsService
      .updateSigners(hash, newSigners, importantOrder, store.getState().authStore.userAccount)
      .then(() => {
        dispatch({ type: documentsConstants.UPDATE_SIGNERS_SUCCESS });
      })
      .catch((e) => {
        console.log(e.toString());
        alert("Error: couldn't update signers!");
        dispatch({ type: documentsConstants.UPDATE_SIGNERS_ERROR });
      });
  };
}

function signDocument(hash) {
  return (dispatch) => {
    dispatch({ type: documentsConstants.SIGN_DOCUMENT_REQUEST });
    documentsService
      .sign(hash, store.getState().authStore.userAccount)
      .then(() => {
        dispatch({ type: documentsConstants.SIGN_DOCUMENT_SUCCESS });
      })
      .catch((e) => {
        console.log(e.toString());
        alert('Error: unable to sign document!');
        dispatch({ type: documentsConstants.SIGN_DOCUMENT_ERROR });
      });
  };
}

function sendDocument(hash) {
  return (dispatch) => {
    dispatch({ type: documentsConstants.SEND_DOCUMENT_REQUEST });
    documentsService
      .send(hash, store.getState().authStore.userAccount)
      .then(() => {
        dispatch({ type: documentsConstants.SEND_DOCUMENT_SUCCESS });
      })
      .catch((e) => {
        console.log(e.toString());
        alert('Error: unable to send document!');
        dispatch({ type: documentsConstants.SEND_DOCUMENT_ERROR });
      });
  };
}

function getVaultDocuments(withSigned = false) {
  return (dispatch) => {
    dispatch({ type: documentsConstants.GET_VAULT_DOCUMENTS_REQUEST });
    documentsService
      .getPastEvents('DocumentSentToSigner', { _signer: store.getState().authStore.userAccount })
      .then(async (asSigner) => {
        documentsService
          .getPastEvents('DocumentCreated', { _author: store.getState().authStore.userAccount })
          .then(async (asAuthor) => {
            const union = [
              ...new Set([
                ...asSigner.map((x) => x.returnValues[0]),
                ...asAuthor.map((x) => x.returnValues[0])
              ])
            ];
            const documents = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const u of union) {
              // eslint-disable-next-line no-await-in-loop
              const document = await documentsService.get(u);
              // eslint-disable-next-line no-await-in-loop
              const timestamp = await documentsService.getBlockTimestamp(document[0]);
              const signedList = [];
              if (withSigned) {
                // eslint-disable-next-line no-await-in-loop
                const signedEvents = await documentsService.getPastEvents('DocumentSigned', {
                  _hash: u
                });
                // eslint-disable-next-line no-restricted-syntax
                for (const s of signedEvents) {
                  signedList.push(s.returnValues[1].toLowerCase());
                }
              }
              const doc = {
                id: u,
                name: document[4],
                status: readStatus(document[6]),
                author: document[3],
                done: { value: document[1], total: document[5].length },
                date: timestamp * 1000,
                signed: signedList,
                signers: document[5].map((x) => x.toLowerCase())
              };
              documents.push(doc);
            }
            dispatch({ type: documentsConstants.GET_VAULT_DOCUMENTS_SUCCESS, documents });
          });
      })
      .catch((e) => {
        console.log(e.toString());
        alert('Error: unable to get documents!');
        dispatch({ type: documentsConstants.GET_VAULT_DOCUMENTS_ERROR });
      });
  };
}

function documentOpened(hash) {
  return (dispatch) => {
    dispatch({ type: documentsConstants.DOCUMENT_OPENED_REQUEST });
    documentsService
      .open(hash, store.getState().authStore.userAccount)
      .then(() => {
        dispatch({ type: documentsConstants.DOCUMENT_OPENED_SUCCESS });
      })
      .catch((e) => {
        console.log(e.toString());
        dispatch({ type: documentsConstants.DOCUMENT_OPENED_ERROR });
      });
  };
}

function clearDocumentsStore() {
  return { type: documentsConstants.CLEAR_DOCUMENT_STORE };
}

async function hashFile(file) {
  const fileBuffer = await file.arrayBuffer();
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return `0x${hash.digest('hex')}`;
}

function hashMsg(msg) {
  const hash = crypto.createHash('sha256');
  hash.update(msg);
  return `0x${hash.digest('hex')}`;
}

function readStatus(status) {
  switch (status) {
    case '0':
      return 'EDITING';
    case '1':
      return 'SIGNING';
    case '2':
      return 'FINISHED';
    default:
      return 'EDITING';
  }
}

export default documentsActions;
