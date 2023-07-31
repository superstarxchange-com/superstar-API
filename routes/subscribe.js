const express = require("express");
const router = express.Router();

const { subscribe } = require("../controllers/subscribe");

router.get("/:email", subscribe);
module.exports = router;
