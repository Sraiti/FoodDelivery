const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/", ensureAuthenticated, (req, res,next) => {
  res.render("index", {
    userName: req.user.name,
  });
});

module.exports = router;
