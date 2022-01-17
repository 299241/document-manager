/* eslint-disable prefer-promise-reject-errors */
import web3, { contract } from '../../utils/web3';

const documentsService = {
  create,
  changeName,
  updateSigners,
  send,
  sign,
  open,
  getStatus,
  get,
  getBlockTimestamp,
  getPastEvents,
  getAllEvents
};

async function create(hash, name, signers, files, importantOrder, filesEncypted, address) {
  try {
    const resp = await (await contract()).methods
      .create(hash, name, signers, files, importantOrder, filesEncypted)
      .send({ from: address, gas: 300000 });
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function changeName(hash, name, address) {
  try {
    const resp = await (await contract()).methods
      .changeName(hash, name)
      .send({ from: address, gas: 300000 });
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function updateSigners(hash, signers, importantOrder, address) {
  try {
    const resp = await (await contract()).methods
      .updateSigners(hash, signers, importantOrder)
      .send({ from: address, gas: 300000 });
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function send(hash, address) {
  try {
    const resp = await (await contract()).methods
      .sendDocument(hash)
      .send({ from: address, gas: 300000 });
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function sign(hash, address) {
  try {
    const resp = await (await contract()).methods.sign(hash).send({ from: address, gas: 300000 });
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function open(hash, address) {
  try {
    const resp = await (await contract()).methods
      .openDocument(hash)
      .send({ from: address, gas: 300000 });
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getStatus(hash) {
  try {
    const resp = await (await contract()).methods.getDocumentStatus(hash).call();
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function get(hash) {
  try {
    const resp = await (await contract()).methods.getDocument(hash).call();
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getBlockTimestamp(blockNumber) {
  try {
    const resp = await web3.eth.getBlock(blockNumber);
    return resp.timestamp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getAllEvents(hash) {
  try {
    const resp = await (
      await contract()
    ).getPastEvents('allEvents', {
      filter: { _hash: hash },
      fromBlock: 0,
      toBlock: 'latest'
    });
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getPastEvents(event, myFilter) {
  try {
    const resp = await (
      await contract()
    ).getPastEvents(event, {
      filter: myFilter,
      fromBlock: 0,
      toBlock: 'latest'
    });
    return resp;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default documentsService;
