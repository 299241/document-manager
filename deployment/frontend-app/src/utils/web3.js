import Web3 from 'web3';
import DocumentManager from '../contracts/DocumentManager.json';

const web3 = new Web3('http://localhost:8545');

export async function contract() {
  const id = await web3.eth.net.getId();
  const deployedNetwork = DocumentManager.networks[id];
  const contract = new web3.eth.Contract(DocumentManager.abi, deployedNetwork.address);

  return contract;
}

export default web3;
