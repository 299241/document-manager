import BufferList from 'bl';
import ipfs from '../../utils/ipfs';

const filesService = {
  addFile,
  getFile
};

async function addFile(file) {
  try {
    const { cid } = await ipfs.add(file);
    return cid;
  } catch (err) {
    return err;
  }
}

async function getFile(cid) {
  const content = new BufferList();

  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of ipfs.cat(cid)) {
    content.append(chunk);
  }

  return content.toString();
}

export default filesService;
