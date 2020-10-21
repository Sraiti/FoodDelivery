const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const cartRouter = express.Router();





cartRouter.get("/", ensureAuthenticated, (req, res) => {

   res.render("user/cart");

});


cartRouter.post("/", ensureAuthenticated, (req, res) => {
 

  console.log(req.body);
  // for the first time creating cart and adding basic object structure
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }
  let cart = req.session.cart;

  console.log(cart);
  // Check if item does not exist in cart
  if (!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      item: req.body,
      qty: 1,
    };
    cart.totalQty = cart.totalQty + 1;
    cart.totalPrice = cart.totalPrice + req.body.price;
  } else {
    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
    cart.totalQty = cart.totalQty + 1;
    cart.totalPrice = cart.totalPrice + req.body.price;
  }
  return res.json({ totalQty: req.session.cart.totalQty });
});

module.exports = cartRouter;
