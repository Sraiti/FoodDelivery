const express = require("express");
const userModel = require("../app/model/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { registringSchema } = require("../app/validation/validaion");

const registerRouter = express.Router();

registerRouter.get("/", (req, res) => {
  res.render("auth/register");
});

registerRouter.post("/", (req, res) => {
  let errors = [];
  const { name, email, password } = req.body;

  const result = registringSchema.validate(req.body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    const message = "Please change the " + error.details[0].path[0];
    console.log(message);
    errors.push({
      msg: message,
    });
    res.render("auth/register", {
      errors,
      name,
      email,
      password,
    });
  } else {
    userModel
      .findOne({
        email: email,
      })
      .then((user) => {
        if (user) {
          ///User Exist
          const message = "Email is already registerd";
          errors.push({
            msg: message,
          });
          res.render("auth/register", {
            errors,
            name,
            email,
            password,
          });
        } else {
          ///User Don't exist
          const newUser = new userModel({
            name,
            email,
            password,
          });

          //Hashing password
          bcrypt.genSalt(15, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              newUser.password = hash;
              newUser
                .save()
                .then(user=>{
                    req.flash(
                        'success_msg',
                        'You are now registered and can log in'
                      );
                      res.redirect('login');
                })
                .catch((err) => {
                  console.log(err);
                });
            })
          );
        }
      });
  }
});

module.exports = registerRouter;
