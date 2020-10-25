const express = require("express");
const odresRouter = express.Router();
const moment = require("moment");

const {
  ensureAuthenticated,
  ensureAdminAuthenticated,
} = require("../middleware/auth");
const Order = require("../app/model/order");

odresRouter.get("/admin", ensureAdminAuthenticated, (req, res) => {
  Order.find({ status: { $ne: "completed" } }, null, {
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

odresRouter.post("/admin/status", ensureAdminAuthenticated, (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId },
    { status: req.body.status },
    (err, data) => {
      if (err) {
        return res.redirect("/orders/admin");
      }
      // Emit event
      const eventEmitter = req.app.get("eventEmitter");
      eventEmitter.emit("orderUpdated", {
        id: req.body.orderId,
        status: req.body.status,
      });
      return res.redirect("/orders/admin");
    }
  );
});

odresRouter.get("/user", ensureAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }, null, {
      sort: { createdAt: -1 },
    });
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.render("user/orders", { orders: orders, moment: moment });
  } catch (error) {
    console.log("err\t" + error);
  }
});

odresRouter.get("/user/:orderId", ensureAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    // Authorize user
    if (req.user._id.toString() === order.customerId.toString()) {
      return res.render("user/singleOrder", { order });
    }
  } catch (error) {
    console.log("err\t" + error);
    return res.redirect("/");
  }
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
