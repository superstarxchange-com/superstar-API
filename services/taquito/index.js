const { MichelsonMap } = require('@taquito/taquito');
const { char2Bytes } = require('@taquito/utils');

const { ADMIN_WALLET_PRIVATE_KEY, OP_CONFIRMATIONS } = require("../../constants");
const { SHOW_ERROR, getTezosAccount } = require("./helper");

/**
 * Adds 1 tz to the newly created user, which can be used for gas fee purposes
 * @param {String} pkh 
 * @returns operation_hash
 */
const add_joining_bonus = async (pkh) => {
    const Tezos = await getTezosAccount(ADMIN_WALLET_PRIVATE_KEY);

    const op = await Tezos.contract.transfer({to: pkh, amount: 0.1});
    return {"hash":op.hash};
}

/**
 * Adds 5 tz to the newly added admin, which can be used for gas fee purposes
 * @param {String} pkh 
 * @returns operation_hash
 */
 const add_joining_bonus_admin = async (pkh) => {
    const Tezos = await getTezosAccount(ADMIN_WALLET_PRIVATE_KEY);

    const op = await Tezos.contract.transfer({to: pkh, amount: 5});
    return {"hash":op.hash};
}

/**
 * @description Mints an NFT with the specified details
 * @permission Admins
 * @param {String} contract_address 
 * @param {String} pkh 
 * @param {String} sk 
 * @param {String} tokenId 
 * @param {Bool} hasMultipleQuantity 
 * @param {Int} quantity 
 * @param {Object} metadata 
 * @returns {String} operation_hash
 */
const mint = async (contract_address, pkh, sk, tokenId, hasMultipleQuantity, quantity, metadata) => {
    const Tezos = await getTezosAccount(sk);
    const meta_data = MichelsonMap.fromLiteral({
        "name" : char2Bytes(metadata.name),
        "symbol" : char2Bytes(metadata.symbol),
        "artifactUri" : char2Bytes(metadata.artifactUri),
        "displayUri" : char2Bytes(metadata.artifactUri),
        "thumbnailUri" : char2Bytes(metadata.thumbnailUri),
        "metadata" : char2Bytes(metadata.metadata),
        "decimals" : char2Bytes("0")
    });
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.mint(hasMultipleQuantity, meta_data, quantity, tokenId, pkh).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
};

/**
 * 
 * @param {String} contract_address 
 * @param {String} sender_sk 
 * @param {String} from 
 * @param {String} tokenId 
 * @param {Int} quantity 
 * @param {String} to 
 * @returns 
 */
const single_transfer = async (contract_address, sender_sk, from, tokenId, quantity, to) => {
    const Tezos = await getTezosAccount(sender_sk);
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.single_transfer(quantity, from, to, tokenId).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
}

/**
 * Initiates an admin. Allowed only for the administrator of smart contracts
 * @param {String} contract_address 
 * @param {List<String>} admins 
 * @returns operation_hash
 */
const init_admin = async (contract_address, admins) => {
    const Tezos = await getTezosAccount(ADMIN_WALLET_PRIVATE_KEY);
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.add_admin(admins).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
}

/**
 * @description Adds the provides list of admins as admins to the smart contract
 * @permission Admins
 * @param {String} contract_address 
 * @param {List<String>} admins 
 * @param {String} sender_sk 
 * @returns {String} operation_hash
 */
const add_admin = async (contract_address, admins, sender_sk) => {
    const Tezos = await getTezosAccount(sender_sk);
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.add_admin(admins).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
}

/**
 * @description Removes the provides list of admins from admins-list of the smart contract
 * @permission Admins
 * @param {String} contract_address 
 * @param {List<String>} admins 
 * @param {String} sender_sk 
 * @returns {String} operation_hash
 */
const remove_admin = async (contract_address, admins, sender_sk) => {
    const Tezos = await getTezosAccount(sender_sk);
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.remove_admin(admins).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
}

/**
 * @description Creates a sale with the specified details
 * @permission Admins
 * @param {String} contract_address
 * @param {String} market_place_addr 
 * @param {String} sender_sk 
 * @param {String} tokenId 
 * @param {Int} price - Note that price will be stored in Mutez (1TEZ = 1e6 Mutez)
 * @param {Int} quantity 
 * @returns operation_hash
 */
const create_sale = async (contract_address, market_place_addr, sender_sk, tokenId, price, quantity) => {
    const Tezos = await getTezosAccount(sender_sk);
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.init_sale(market_place_addr, price, quantity, tokenId).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
}

/**
 * @description Updates a given sale with the updated details
 * @permission Sale Creator
 * @param {String} contract_address 
 * @param {String} sender_sk 
 * @param {String} tokenId 
 * @param {Int} price 
 * @param {Int} quantity 
 * @returns operation_hash
 */
const update_sale = async (contract_address, sender_sk, tokenId, price, quantity) => {
    const Tezos = await getTezosAccount(sender_sk);
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.update_sale(price, quantity, tokenId).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
}

/**
 * @description Removes a given sale
 * @permission Sale Creator
 * @param {String} contract_address 
 * @param {String} sender_sk 
 * @param {String} tokenId 
 * @returns operation_hash
 */
const remove_sale = async (contract_address, sender_sk, tokenId) => {
    const Tezos = await getTezosAccount(sender_sk);
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.remove_sale(tokenId).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
}

/**
 * @description Transfers the specified NFT to the specified buyer
 * @permission Admin
 * @param {String} contract_address 
 * @param {String} sender_sk 
 * @param {String} buyer 
 * @param {Int} quantity 
 * @param {String} tokenId 
 * @returns operation_hash
 */
const buy = async (contract_address, sender_sk, buyer, tokenId, quantity) => {
    const Tezos = await getTezosAccount(sender_sk);
    const contract = await Tezos.contract.at(contract_address);
    const op = await contract.methods.buy(buyer, quantity, tokenId).send();
    // await op.confirmation(OP_CONFIRMATIONS);
    return {"hash":op.hash};
}

const create_auction = async () => {
    ;
}

const bid = async () => {
    ;
}

const claim = async () => {
    ;
}



module.exports = {
    add_joining_bonus,
    add_joining_bonus_admin,
    init_admin,
    add_admin,
    remove_admin,
    mint,
    single_transfer,
    create_sale,
    update_sale,
    remove_sale,
    buy,
    create_auction,
    bid,
    claim
};