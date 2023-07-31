const initiatePayment = require("./payment.service");

/**
 * @description Generate random numbers
 * @returns {Number} numbers
 */
function generateNumber() {
  let str = "";
  const characters = "123456789";
  for (let i = 0; i < 8; i += 1) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return Number(str);
}

const fundingService = async (customerId, email, body) => {
  let accountNumber;
  try {
    const response = await initiatePayment();
    console.log("Response", response);
    const { amount } = response;

    const funding = await db.Funding.create({
      customerId,
      amount,
    });

    const userWallet = await db.Wallet.findOne({
      where: {
        customerId,
      },
    });

    if (userWallet) {
      userWallet.balance += amount;
      userWallet.save();
    }

    if (userWallet === null) {
      accountNumber = generateNumber();

      await db.Wallet.create({
        customerId,
        accountNumber,
        balance: amount,
      });
    }
    const transaction = new db.Transaction();
    transaction.amount = amount;
    transaction.accountNumber = accountNumber || userWallet.accountNumber;
    transaction.narration = `fund_account_wallet: ${
      accountNumber || userWallet.accountNumber
    }`;
    transaction.type = "funding";
    await transaction.save();

    return funding;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = fundingService;
