const express = require("express");
const usersRouter = express.Router();
const userModel = require('../app/model/user');
const { ensureAuthenticated } = require("../config/auth");


usersRouter.get("/", ensureAuthenticated, async (req, res,next)  => {
    const users = await userModel.find()
  res.render("admin/users",{
    users
  });
});

module.exports = usersRouter;
