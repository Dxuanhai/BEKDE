"use strict";

const express = require("express");
const router = express.Router();

//router.use("/v1/api/profie", require("./profile"));
router.use("/v1/api/auth", require("./auth"));

module.exports = router;
