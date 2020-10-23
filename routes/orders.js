const express = require("express");
const odresRouter = express.Router();
 
const {
  ensureAuthenticated,
  ensureAdminAuthenticated,
} = require("../middleware/auth");
const Order = require("../app/model/order");

odresRouter.get("/admin", ensureAdminAuthenticated, (req, res) => {

  Order
  .find({ status: { $ne: "completed" } }, null, {
    sort: { createdAt: -1 },
  })
  .populate("customerId", "-password")
  .exec((err, orders) => {
    if (req.xhr) {
      return res.json(orders);
    } else {
      return res.render("admin/orders");
    }
  });
});

odresRouter.post("/", ensureAuthenticated, (req, res) => {
  console.log("order post");

  // Validate request
  const { phone, address, map } = req.body;
  if (!phone || !address) {
    req.flash("error", "phone and address are required");
    return res.redirect("/cart");
  }

  const order = new Order({
    customerId: req.user._id,
    items: req.session.cart.items,
    phone,
    address,
    map,
  });

  order
    .save()
    .then((result) => {
      Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
        req.flash("success", "Order placed successfully");

        delete req.session.cart;
        // Emit
        const eventEmitter = req.app.get("eventEmitter");
        eventEmitter.emit("orderPlaced", placedOrder);
        return res.redirect("/");
      });
    })
    .catch((err) => {
      req.flash("error", "Something went wrong");
      return res.redirect("/cart");
    });
});

module.exports = odresRouter;
