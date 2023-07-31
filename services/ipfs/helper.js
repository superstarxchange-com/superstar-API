const fs = require("fs");

const IpfsUrl = (IpfsHash) => {
  return `https://superstarxchange.mypinata.cloud/ipfs/${IpfsHash}`;
};

const IpfsUri = (IpfsHash) => {
  return `ipfs://${IpfsHash}`;
};

const createReadableStreamOfFile = (path = "test_nft.gif") => {
  return fs.createReadStream(path);
};

const filePinataMetadata = (name) => {
  return { name: name, keyvalues: {} };
};

const metadataPinataMetadata = (nftId) => {
  return { name: `${nftId}`, keyvalues: {} };
};

module.exports = {
  IpfsUrl,
  IpfsUri,
  createReadableStreamOfFile,
  filePinataMetadata,
  metadataPinataMetadata,
};
