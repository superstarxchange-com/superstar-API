require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("_middleware/error-handler");
const { verifyPaymentStatus } = require("./controllers/payment");
const Mutex = require("async-mutex").Mutex;
const withTimeout = require("async-mutex").withTimeout;
// array  of mutexes:
global.mutex_array = [];
global.mutex = withTimeout(new Mutex(), 120000);
app.use("/stripe", express.raw({ type: "*/*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// api routes
app.use("/users", require("./controllers/user.controller"));
app.use("/wallet", require("./controllers/wallet.controller"));
app.use("/funding", require("./controllers/funding.controller"));
app.use("/fa2", require("./controllers/tz.fa2.controller"));
app.use("/market-place", require("./controllers/tz.marketplace.controller"));
app.use("/auction-place", require("./controllers/tz.auctionplace.controller"));
app.use("/ipfs", require("./controllers/tz.ipfs.controller"));
app.use("/accounts", require("./controllers/tz.accounts.controller"));
app.use("/status", require("./controllers/health_check"));
app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  verifyPaymentStatus
);
app.use("/subscribe", require("./routes/subscribe"));
// global error handler
app.use(errorHandler);

//const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const port = 80;
app.listen(port, () => console.log("Server listening on port " + port));
