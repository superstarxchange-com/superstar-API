const { buy } = require("../services/taquito/index");
const db = require("_helpers/db");
const schedule = require("node-schedule");

const {
  ADMIN_WALLET_PRIVATE_KEY,
  CONTRACT_ADDRESS_MARKET_PLACE,
} = require("../constants");
const {
  handleErrorResponse,
  handleTaquitoSuccessResponse,
  handleTaquitoErrorResponse,
} = require("../_helpers/utils");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.initiatePayment = async (req, res) => {
  const { nft, user_id, user_address } = req.body;
  // check in the Database:
  const safe_for_sale = await db.exclusive_pay.findOne({
    where: { nft_id: nft.id, inProcess: 0 },
  });

  if (safe_for_sale) {
    // insert into db and set status to available:
    // await db.exclusive_pay.create({ nft_id: nft.id, inProcess: 1 });
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(nft.price) * 100,
        currency: "inr",
        payment_method_types: ["card"],
        metadata: {
          user_address: user_address,
          user_id: user_id,
          nft_id: nft.id,
          nft_name: nft.name,
        },
      });
      const clientSecret = paymentIntent.client_secret;
      // push into the mutex array:
      await db.exclusive_pay.update(
        { inProcess: 1 },
        { where: { nft_id: nft.id } }
      );
      const date = new Date();
      const d = new Date();
      date.setMinutes(d.getMinutes() + 2);
      const job = schedule.scheduleJob(date, async function () {
        await db.exclusive_pay.update(
          { inProcess: 0 },
          { where: { nft_id: nft.id } }
        );
        console.log(`Scheduler updated the status of the nft: ${nft.id}`);
      });
      res
        .status(200)
        .json({ clientSecret: clientSecret, message: "Payment Initiated" });
    } catch (err) {
      // console.error(err);
      await db.exclusive_pay.update(
        { inProcess: 0 },
        { where: { nft_id: nft.id } }
      );
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(400).json({ message: "Please wait for some time." });
  }
};

module.exports.verifyPaymentStatus = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  const endpointSecret = process.env.STRIPE_HOOK_SECRET;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const user_id = paymentIntent.metadata.user_id;
      const nft_id = paymentIntent.metadata.nft_id;
      console.log(`PaymentIntent`, paymentIntent.id);
      _buy(paymentIntent.metadata, paymentIntent.id);
      // release the lock:
      await db.exclusive_pay.update(
        { inProcess: 0 },
        { where: { nft_id: nft_id } }
      );
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    case "payment_intent.canceled":
      await db.exclusive_pay.update(
        { inProcess: 0 },
        { where: { nft_id: nft_id } }
      );
      break;
    case "payment_intent.payment_failed":
      await db.exclusive_pay.update(
        { inProcess: 0 },
        { where: { nft_id: nft_id } }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      await db.exclusive_pay.update(
        { inProcess: 0 },
        { where: { nft_id: nft_id } }
      );
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

async function _buy(buyerData, payment_intentID) {
  try {
    //! check if req.body.buyer has paid
    const paid = true;
    const sk = ADMIN_WALLET_PRIVATE_KEY;
    const data = await buy(
      CONTRACT_ADDRESS_MARKET_PLACE,
      sk,
      buyerData.user_address,
      buyerData.nft_id,
      1
    );
  } catch (error) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: payment_intentID,
      });
    } catch (error) {}
  }
}
