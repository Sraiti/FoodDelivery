const express = require("express");
const router = express.Router();
const { loginSchema } = require("../app/validation/validaion");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("auth/login");
});
router.post("/", (req, res, next) => {
  let errors = [];
  const { email, password } = req.body;

  const result = loginSchema.validate(req.body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    const message = "Please change the " + error.details[0].path[0];
    errors.push({
      msg: message,
    });
    res.render("auth/login", {
      errors,
      email,
      password,
    });
  } else {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
      failWithError: "/login",
    })(req, res, next);
  }
});
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

module.exports = router;
