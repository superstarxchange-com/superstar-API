var express = require('express');
var router = express.Router();
const authorize = require('../_middleware/authorize');

const { create_auction, bid, claim } = require("../services/taquito/index");

router.post('/create-auction', authorize(), _create_auction);
router.post('/bid', authorize(), _bid);
router.post('/claim', authorize(), _claim);

async function _create_auction(req, res, next){
    ;
}

async function _bid(req, res, next){
    ;
}

async function _claim(req, res, next){
    ;
}

module.exports = router;