const {createReadableStreamOfFile, metadataPinataMetadata, filePinataMetadata} = require('./helper.js');
const { pinFile, pinMetaData } = require('./pinata');
const fs = require('fs');

const pinNFTfile = async (original_name, path) => {
    try{
        const hash = await pinFile(createReadableStreamOfFile(path), filePinataMetadata(original_name));
        fs.unlinkSync(path);
        return hash;
    }catch(err){console.log(err);}
}

const pinNFT = async (nftMetadata) => {
    try{
        return await pinMetaData(nftMetadata, metadataPinataMetadata(nftMetadata.nftID));
    }catch(err){console.log(err);}
}

// TO-DO
const getPinnedNFT = async (metadataHash) => {
    try{
        ;
    }catch(err){console.log(err);}
}

module.exports = {
    pinNFTfile,
    pinNFT
}