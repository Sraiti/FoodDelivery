const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    size: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MenuItems", menuItemSchema);
