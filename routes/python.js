const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("blockpy", {
  });
});
router.get("/pygame4skulpt", function (req, res, next) {
  res.render("pygame", {
  });
});
module.exports = router;