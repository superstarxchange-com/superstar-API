var express = require('express');
var router = express.Router();

const {isValidAddress, createAccount, recoverKeysFromMnemonic} = require("../services/taquito/accounts/wallet");

router.get('/check-validity', check_validity);
router.get('/create-account', create_account);
router.get('/recover-account', recover_account);

async function check_validity(req, res, next){
    const result = isValidAddress(req.body.address);
    res.send({msg: result});
}

async function create_account(req, res, next){
    let result;
    if(req.body.passphrase)
        result = await createAccount(req.body.passphrase);
    else
        result = await createAccount();
    res.send({result : result});
}

async function recover_account(req, res, next){
    const result = await recoverKeysFromMnemonic(req.body.mnemonic);
    res.send({result : result, status: "In dev"});
}

module.exports = router;