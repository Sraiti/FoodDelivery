const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userModel = require("../app/model/user");
const passport = require("passport");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      userModel
        .findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "that email is not registerd",
            });
          }

          //Matching the Password

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              done(null, user);
            } else {
              done(null, false, {
                message: "password dosen't match",
              });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel
    .findById(id, (err, user) => {
      done(err, user);
    })
    .catch((err) => console.log(err));
});
