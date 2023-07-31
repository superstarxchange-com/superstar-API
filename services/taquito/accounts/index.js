const { ADMIN_WALLET_PRIVATE_KEY, OP_CONFIRMATIONS } = require("../../../constants");
const { SHOW_ERROR, getTezosAccount } = require("../helper");

const transfer = async (address, amount) => {
    try{
      const Tezos = getTezosAccount(ADMIN_WALLET_PRIVATE_KEY);
      const op = await Tezos.contract.transfer({to:address,amount: amount});
      await op.confirmation(OP_CONFIRMATIONS);
      return op.hash;
    }catch(error){
      SHOW_ERROR(error);
    }
}

const balance = async (address)=>{
    try{
        if(address == null) return 0;
        const Tezos = getTezosAccount(ADMIN_WALLET_PRIVATE_KEY);
        const bal = await Tezos.tz.getBalance(address);
        return bal.toNumber();
    }catch(error){
        SHOW_ERROR(error);
    }
}

module.exports = {
  transfer,
  balance,
}