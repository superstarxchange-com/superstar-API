

 const db = require('../_helpers/db');

  const {
    handleErrorResponse,
    handleSuccessResponse,
  }=require( '../_helpers/utils');

  const transferService = require( '../services/transfer.service');
  
  const authorize = require('../_middleware/authorize');

  const express = require('express');

  


  /**
   * @description wallet Controller
   * @class walletController
   */
  
    /**
     * @description Transfer
     * @static
     * @param {object} req
     * @param {object} res
     * @returns {object} transfer
     * @member WalletController
     */
     async function transferToWallet(req, res) {
      try {
        const customerId = req.id;
        const transfer = await transferService(req.body.amount, req.body.accountNumber, customerId);
        return handleSuccessResponse(res, transfer, 201);
      } catch (error) {
        return handleErrorResponse(res, error, 500);
      }
    }
  
    /**
     * @description View Wallet
     * @static
     * @param {object} req
     * @param {object} res
     * @returns {object} wallet
     * @member WalletController
     */
      async function getWallet(req, res) {
      try {
        const customerId = req.id || req.params.id;
        const wallet = await db.Wallet.findOne({
          where: {
            customerId
          }
        });
        console.log("wallet",wallet,customerId);
        return handleSuccessResponse(res, wallet, 200);
      } catch (error) {
        console.log("error",error);
      }
    }
  
    /**
     * @description View Wallet transactions
     * @static
     * @param {object} req
     * @param {object} res
     * @returns {object} transactions
     * @member WalletController
     */
     async function getWalletTransactions(req, res) {
      try {
        const {
          accountNumber
        } = req.params;
        const transactions = await db.Transaction.findAll({
          where: {
            accountNumber
          }
        });
        return handleSuccessResponse(res, transactions, 200);
      } catch (error) {
        return handleErrorResponse(res, error, 500);
      }
    }
  
  const  router = express.Router();

  router.post('/wallets/transfer',authorize(),transferToWallet);
  router.get('/wallets/:customerId',authorize(),getWallet);

  router.get('/transactions/:accountNumber',authorize(),getWalletTransactions);

  module.exports = router;
  
  
