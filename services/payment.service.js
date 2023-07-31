const stripe = require("stripe")(
  "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"
);

async function initiatePayment(req, res) {
  try {
    const payment = await stripe.paymentIntents.create({
      amount: 200000,
      currency: "inr",
      payment_method_types: ["card"],
    });
    console.log("payment", payment);
    res.send(payment);
  } catch (err) {
    console.log("error", err);
  }
}
module.exports = initiatePayment;
