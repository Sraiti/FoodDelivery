const express = require("express");
const usersRouter = express.Router();
const userModel = require("../app/model/user");
const { ensureAdminAuthenticated } = require("../middleware/auth");

usersRouter.get("/", ensureAdminAuthenticated, async (req, res, next) => {
  const users = await userModel.find();
  res.render("admin/users", {
    users,
  });
});

usersRouter.post("/:id", ensureAdminAuthenticated, async (req, res, next) => {
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

usersRouter.get("/delete/:id", ensureAdminAuthenticated, (req, res, next) => {
  console.log("Delete Request");

  const itemId = req.params.id;
  console.log(itemId);

  userModel.findByIdAndRemove(itemId, async(err, docs)=> {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed User : ", docs);
      userModel.find().then(async (items) => {
        console.log("then");
        const users = await userModel.find();
        res.render("admin/users", {
          users,
        });
      });
    }
  });
});
module.exports = usersRouter;
