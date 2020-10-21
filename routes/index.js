const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const menuModel = require("../app/model/menuItem");

router.get("/", ensureAuthenticated, (req, res,next) => {

  menuModel.find().then((items) => {
    res.render("index", {
      items,
    });
  });
 
});

module.exports = router;
