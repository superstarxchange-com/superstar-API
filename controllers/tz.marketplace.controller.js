var express = require('express');
var router = express.Router();
const authorize = require('../_middleware/authorize');

const { create_sale, update_sale, remove_sale, buy } = require("../services/taquito/index");
const { CONTRACT_ADDRESS_FA2, ADMIN_WALLET_PRIVATE_KEY, CONTRACT_ADDRESS_MARKET_PLACE } = require("../constants");
const { decode, handleErrorResponse, handleTaquitoSuccessResponse, handleTaquitoErrorResponse } = require('../_helpers/utils');

router.post('/create-sale', authorize(), _create_sale);
router.post('/update-sale', authorize(), _update_sale);
router.post('/remove-sale', authorize(), _remove_sale);
router.post('/buy', authorize(), _buy);

/**
 * @description Creates a sale from the available NFTs which were minted by the particular admin
 * @permission admin
 * @param {*} req {tokenId, password, price, quantity}
 * @param {*} res 
 * @param {*} next 
 * @returns HttpsResponse
 */
async function _create_sale(req, res, next){
    try{
        if(!req.user.isAdmin) return handleErrorResponse(res, {name: "Unauthorized"}, 401);
        const sk = decode(ADMIN_WALLET_PRIVATE_KEY, req.user.secret_key, req.body.password);
        const data = await create_sale(CONTRACT_ADDRESS_FA2, CONTRACT_ADDRESS_MARKET_PLACE, sk, req.body.tokenId, req.body.price, req.body.quantity);
        return handleTaquitoSuccessResponse(res, data);
    }catch(error){
        console.log("error",error);
        return handleTaquitoErrorResponse(res, error);
    }
}

/**
 * @description Updates a sale which is created by the particular admin
 * @permission admin
 * @param {*} req {tokenId, password, price, quantity}
 * @param {*} res 
 * @param {*} next 
 * @returns HttpsResponse
 */
async function _update_sale(req, res, next){
    try{
        if(!req.user.isAdmin) return handleErrorResponse(res, {name: "Unauthorized"}, 401);
        const sk = decode(ADMIN_WALLET_PRIVATE_KEY, req.user.secret_key, req.body.password);
        const data = await update_sale(CONTRACT_ADDRESS_MARKET_PLACE, sk, req.body.tokenId, req.body.price, req.body.quantity);
        return handleTaquitoSuccessResponse(res, data);
    }catch(error){
        return handleTaquitoErrorResponse(res, error);
    }
}

/**
 * @description Deletes a sale which is created by the particular admin
 * @permission admin
 * @param {*} req {tokenId, password}
 * @param {*} res 
 * @param {*} next 
 * @returns HttpsResponse
 */
async function _remove_sale(req, res, next){
    try{
        if(!req.user.isAdmin) return handleErrorResponse(res, {name: "Unauthorized"}, 401);
        const sk = decode(ADMIN_WALLET_PRIVATE_KEY, req.user.secret_key, req.body.password);
        const data = await remove_sale(CONTRACT_ADDRESS_MARKET_PLACE, sk, req.body.tokenId);
        return handleTaquitoSuccessResponse(res, data);
    }catch(error){
        return handleTaquitoErrorResponse(res, error);
    }
}

/**
 * @description Buys a specified NFT, after verifying the payment 
 * @permission Anyone
 * @param {*} req {tokenId, quantity}
 * @param {*} res 
 * @param {*} next 
 * @returns HttpsResponse
 */
async function _buy(req, res, next){
    try{
        //! check if req.body.buyer has paid
        const paid = true;
        if(!paid) return handleErrorResponse(res, {name: "Unauthorized"}, 401);
        const sk = ADMIN_WALLET_PRIVATE_KEY;
        const data = await buy(CONTRACT_ADDRESS_MARKET_PLACE, sk, req.user.pkh, req.body.tokenId, req.body.quantity);
        return handleTaquitoSuccessResponse(res, data);
    }catch(error){
        return handleTaquitoErrorResponse(res, error);
    }
}

module.exports = router;