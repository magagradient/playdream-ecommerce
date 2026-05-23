const express = require("express");
const router = express.Router();
const sendContact = require("../controllers/contact/post/sendContact");

router.post("/", sendContact);

module.exports = router;