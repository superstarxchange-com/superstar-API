var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { pinNFTfile, pinNFT } = require("../services/ipfs/index.js");
const { IpfsUrl, IpfsUri } = require("../services/ipfs/helper");

router.post("/pin-file", upload.single("image"), pin_file);
router.post("/pin-nft-metadata", pin_nft_metadata);

async function pin_file(req, res, next) {
  if (!req.file) {
    res.send({ msg: "No file provided" });
    return;
  }
  const file_type = req.file.mimetype;
  if (
    !(
      file_type == "image/png" ||
      file_type == "image/jpg" ||
      file_type == "image/jpeg" ||
      file_type == "image/gif"
    )
  ) {
    res.send({ msg: "File not supported" });
    return;
  }
  const hash = await pinNFTfile(req.file.originalname, req.file.path);
  res.send({ hash: IpfsUri(hash), url: IpfsUrl(hash) });
}

async function pin_nft_metadata(req, res, next) {
  const metadata = {
    nftID: req.body.nftID,
    name: req.body.name,
    movie: req.body.movie,
    description: req.body.description,
    symbol: req.body.symbol,
    creator: req.body.creator,
    editions: req.body.editions,
    mainAsset: req.body.mainAsset,
    thumbnail: req.body.thumbnail, 
    certificate: req.body.certificate,
    moviePoster: req.body.moviePoster,
  };
  const hash = await pinNFT(metadata); 
  res.send({ hash: IpfsUri(hash), url: IpfsUrl(hash) });
}

module.exports = router;
