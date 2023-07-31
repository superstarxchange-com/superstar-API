const fundingService = require("../services/funding.service");
const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../_helpers/utils");
const express = require("express");
const authorize = require("../_middleware/authorize");

const { initiatePayment } = require("./payment");

async function fundAccount(req, res) {
  try {
    const customerId = req.body.id;
    const funding = await fundingService(customerId, req.email, req.body);
    return handleSuccessResponse(res, funding, 201);
  } catch (error) {
    console.log("error", error);
  }
}
const router = express.Router();

router.post("/fundAccount", authorize(), fundAccount); 
router.post("/pay", initiatePayment);

module.exports = router;
