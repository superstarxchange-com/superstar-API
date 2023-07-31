var express = require("express");
var router = express.Router();
const authorize = require("../_middleware/authorize");

const {
  mint,
  single_transfer,
  init_admin,
  add_admin,
  remove_admin,
  test,
} = require("../services/taquito/index");
const {
  CONTRACT_ADDRESS_FA2,
  ADMIN_WALLET_PRIVATE_KEY,
  CONTRACT_ADDRESS_MARKET_PLACE,
  NODE_ENV,
} = require("../constants");
const { isValidAddress } = require("../services/taquito/accounts/wallet");
const {
  decode,
  handleErrorResponse,
  handleTaquitoSuccessResponse,
  handleTaquitoErrorResponse,
} = require("../_helpers/utils");

router.post("/init-admin", _init_admin);
router.post("/add-admin", authorize(), _add_admin);
router.post("/remove-admin", authorize(), _remove_admin);
router.post("/mint", authorize(), _mint);

/**
 * Inits an admin
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 * @permission Administrator
 * @returns operation_hash
 */
async function _init_admin(req, res, next){
  try {
    if(req.body.sk == ADMIN_WALLET_PRIVATE_KEY){
      const data = await init_admin(CONTRACT_ADDRESS_FA2, [req.body.admin]);
      return handleTaquitoSuccessResponse(res, data);
    }
    return handleTaquitoErrorResponse(res, {name: "Unauthorized"}, 401);
  } catch(error) {
    return handleTaquitoErrorResponse(res, error);
  }
}

/**
 * @description Gives admin access to a given 'admin'
 * @permission admin
 * @param {Object} req {admin, password}
 * @param {Object} res
 * @param {*} next
 * @returns {HttpResponse}
 */
async function _add_admin(req, res, next) {
  try {
    if (req.user.isAdmin) {
      // const sk = decode(ADMIN_WALLET_PRIVATE_KEY, req.user.secret_key, req.body.password);
      const sk = ADMIN_WALLET_PRIVATE_KEY;
      const data = await add_admin(CONTRACT_ADDRESS_FA2, [req.body.admin], sk);
      return handleTaquitoSuccessResponse(res, data);
    }
    return handleErrorResponse(res, { name: "Unauthorized" }, 401);
  } catch (error) {
    return handleTaquitoErrorResponse(res, error);
  }
}

/**
 * @description Removes a given 'admin' from admin access
 * @permission admin
 * @param {Object} req {admin, password}
 * @param {Object} res
 * @param {*} next
 * @returns {HttpResponse}
 */
async function _remove_admin(req, res, next) {
  try {
    if (req.user.isAdmin) {
      //const sk = decode(ADMIN_WALLET_PRIVATE_KEY, req.user.secret_key, req.body.password);
      const sk = ADMIN_WALLET_PRIVATE_KEY;
      const data = await remove_admin(
        CONTRACT_ADDRESS_FA2,
        [req.body.admin],
        sk
      );
      return handleTaquitoSuccessResponse(res, data);
    }
    return handleErrorResponse(res, { name: "Unauthorized" }, 401);
  } catch (error) {
    return handleTaquitoErrorResponse(res, error);
  }
}

/**
 * @description Mints an NFT with the given data.
 * @permission admin
 * @param {*} req {tokenId, password, hasMultipleQuantity, quantity, metadata}
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function _mint(req, res, next) {
  try {
    if (req.user.isAdmin) {
      const sk = decode(
        ADMIN_WALLET_PRIVATE_KEY,
        req.user.secret_key,
        req.body.password
      );
      console.log("SK", sk);
      const data = await mint(
        CONTRACT_ADDRESS_FA2,
        req.user.pkh,
        sk,
        req.body.tokenId,
        req.body.hasMultipleQuantity,
        req.body.quantity,
        req.body.metadata
      );
      return handleTaquitoSuccessResponse(res, data);
    }
    return handleErrorResponse(res, { name: "Unauthorized" }, 401);
  } catch (error) {
    console.error(error);
    return handleTaquitoErrorResponse(res, error);
  }
}

module.exports = router;
