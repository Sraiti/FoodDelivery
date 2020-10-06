module.exports = {
  ensureAuthenticated:  (req, res, next)=> {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to access");
    res.redirect("/login");
  },

  forwardAuthenticated:  (req, res, next)=> {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
};
