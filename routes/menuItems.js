const express = require("express");
const menuRouter = express.Router();
const menuModel = require("../app/model/menuItem");
var multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Math.floor(Math.random() * Math.floor(420)) +
        `${Date.now()}` +
        file.originalname
    );
  },
});

const upload = multer({ storage });

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong! " + err);
};

const path = require("path");

const { ensureAdminAuthenticated } = require("../middleware/auth");

menuRouter.get("/", ensureAdminAuthenticated, (req, res, next) => {
  menuModel.find().then((items) => {
    res.render("admin/menuitems", {
      items,
    });
  });
});

menuRouter.get("/delete/:id", ensureAdminAuthenticated, (req, res, next) => {
  console.log("Delete Request");

  const itemId = req.params.id;
  console.log(itemId);

  menuModel.findByIdAndRemove(itemId, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed User : ", docs);
      menuModel.find().then((items) => {
        console.log("then");
        menuModel.find().then((items) => {
          res.render("admin/menuitems", {
            items,
          });
        });
      });
    }
  });
});
///new From

menuRouter.get("/new", ensureAdminAuthenticated, (req, res, next) => {
  res.render("admin/newForm", {
    newItem: {
      name: "",
      image: "",
      filePath: "",
      description: "",
      price: "",
      size: "",
    },
  });
});

menuRouter.post(
  "/",
  upload.single("file"),
  ensureAdminAuthenticated,
  (req, res, next) => {
    if (req.file) {
      const { name, price, description, size } = req.body;
      const filePath = req.file.path;

      const menuItem = new menuModel({
        name,
        image: filePath,
        description,
        price,
        size,
      });

      menuItem
        .save()
        .then((newItem) => {
          res.render("admin/newForm", {
            newItem,
            msg: "Menu item added",
          });
        })
        .catch((err) => console.log("shit went down"));
    } else {
    }
  }
);

///Edit Form

menuRouter.get(
  "/edit/:id",
  upload.single("file"),
  ensureAdminAuthenticated,
  (req, res, next) => {
    console.log('GET("/edit/:id)');

    itemId = req.params.id;
    menuModel.findById(itemId).then((menuItem) => {
      res.render("admin/editForm", {
        menuItem,
        updated: false,
      });
    });
  }
);

menuRouter.post(
  "/edit/:id",
  upload.single("file"),
  ensureAdminAuthenticated,
  (req, res, next) => {
    itemId = req.params.id;

    const { name, price, description, size } = req.body;

    if (req.file) {
      const filePath = req.file.path;
      menuModel.findByIdAndUpdate(
        { _id: itemId },
        { name, image: filePath, description, price, size },
        function (err, result) {
          if (err) {
          } else {
            res.render("admin/editForm", {
              menuItem: result,
              updated: true,
            });
          }
        }
      );
    } else {
      menuModel.findByIdAndUpdate(
        { _id: itemId },
        { name, description, price, size },
        { new: true },
        function (err, result) {
          if (err) {
          } else {
            res.render("admin/editForm", {
              menuItem: result,
              updated: true,
            });
          }
        }
      );
    }
  }
);
 

module.exports = menuRouter;
