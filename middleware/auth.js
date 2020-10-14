module.exports = {

  ensureAdminAuthenticated:(req, res, next)=> {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    req.flash("error_msg", "you're not allowed");
    res.redirect("/");
  },


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
