const express = require("express");
const usersRouter = express.Router();
const userModel = require("../app/model/user");
const { ensureAuthenticated } = require("../config/auth");

usersRouter.get("/", ensureAuthenticated, async (req, res, next) => {
  const users = await userModel.find();
  res.render("admin/users", {
    users,
  });
});

usersRouter.post("/:id", ensureAuthenticated, async (req, res, next) => {
  const newRole = req.body.role.toLowerCase();
  console.log(newRole);
  userId = req.params.id;
  console.log(req.params.id);
  userModel
    .findByIdAndUpdate({ _id: userId }, { role: newRole })
    .then(async (updatedUser) => {
      const users = await userModel.find();
      res.render("admin/users", {
        users,
      });
    });
});
module.exports = usersRouter;
