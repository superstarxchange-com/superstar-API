// https://wiki.tezosagora.org/build/create-a-tezos-token/nft
const pinataSDK = require('@pinata/sdk');
const {NODE_ENV, PINATA_API_KEY, PINATA_SECRET_KEY} = require('../../constants.js');

let pinata;

pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);


const pinFile = async (readableStreamOfFile, pinataMetadata) => {
    try{
        await pinata.testAuthentication();
        const pinnedFile = await pinata.pinFileToIPFS(
            readableStreamOfFile,
            {pinataMetadata: pinataMetadata}
        );

        if(pinnedFile.IpfsHash && pinnedFile.PinSize>0){
            return pinnedFile.IpfsHash;
        }
        
        throw `File Pin Not Successful: Hash-${pinnedFile.IpfsHash} : Size-${pinnedFile.PinSize}`;
    }catch(err){console.log(err)};
}

const pinDirectory = async (path, pinataMetadata) => {
    try{
        await pinata.testAuthentication();

        const pinnedFolder = await pinata.pinFromFS(
            path,
            {pinataMetadata: pinataMetadata}
        );

        if(pinnedFolder.IpfsHash && pinnedFolder.PinSize>0){
            return pinnedFolder.IpfsHash;
        }
        
        throw `Folder Pin Not Successful: Hash-${pinnedFolder.IpfsHash} : Size-${pinnedFolder.PinSize}`;
    }catch(err){console.log(err);}
}

const pinMetaData = async (nftMetadata, pinataMetadata) => {
    try{
        await pinata.testAuthentication();
        
        const metadata = {
            nftID: nftMetadata.nftID,
            name: nftMetadata.name,
            description: nftMetadata.description,
            decimals: 0,
            symbol: nftMetadata.symbol,
            creators: [nftMetadata.creator],
            editions: nftMetadata.editions,
            mainAsset: nftMetadata.mainAsset,
            thumbnail: nftMetadata.thumbnail,
            certificate: nftMetadata.certificate,
            moviePoster: nftMetadata.moviePoster
        };
        const pinnedMetadata = await pinata.pinJSONToIPFS(
            metadata,
            {pinataMetadata: pinataMetadata}
        );

        if(pinnedMetadata.IpfsHash && pinnedMetadata.PinSize>0){
            return pinnedMetadata.IpfsHash;
        }
        
        throw `Folder Pin Not Successful: Hash-${pinnedMetadata.IpfsHash} : Size-${pinnedMetadata.PinSize}`;
    }catch(err){console.log(err);}
}

module.exports = {
    pinFile,
    pinMetaData,
}