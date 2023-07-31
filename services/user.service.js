const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const createAccount=require('./taquito/accounts/wallet');
const crypto=require('crypto');
const { add_joining_bonus, add_joining_bonus_admin } = require('./taquito/index');

const { encode } = require('../_helpers/utils');
const { ADMIN_WALLET_PRIVATE_KEY } = require('../constants');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    createAdmin,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}
function generateNumber(){
    
    let str = '';
    const characters = '123456789';
    for (let i = 0; i < 8; i += 1) {
      str += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return Number(str);
}
function generateCustomerId(){
    
    let str = '';
    const characters = '123456';
    for (let i = 0; i < 5; i += 1) {
      str += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return Number(str);
}

async function create(params) {
    // validate
    //let accountNumber=generateNumber();
    //let customerId=generateCustomerId();
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }
    let tz=await createAccount.createAccount();
    params.secret_key=encode(ADMIN_WALLET_PRIVATE_KEY, tz.sk, params.password);
    params.pkh=tz.pkh
    // save user
    await db.User.create(params);
    await add_joining_bonus(params.pkh);
    /*await db.Wallet.create({
        customerId,
        accountNumber,
        balance:0
    })*/
}

async function createAdmin(params) {
    // validate
    //let accountNumber=generateNumber();
    //let customerId=generateCustomerId();
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }
    let tz=await createAccount.createAccount();
    
    params.secret_key=encode(ADMIN_WALLET_PRIVATE_KEY, tz.sk, params.password);
    params.pkh=tz.pkh
    
    // save user
    await db.User.create(params);
    await add_joining_bonus_admin(params.pkh);

    return tz.pkh;
    /*await db.Wallet.create({
        customerId,
        accountNumber,
        balance:0
    })*/
}


async function update(id, params) {
    const user = await getUser(id);

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}