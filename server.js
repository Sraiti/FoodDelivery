if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayout = require("express-ejs-layouts");
const port = 3000 || process.env.PORT;

const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const usersRouter = require("./routes/users");
const menuItemsRouter = require("./routes/menuItems");
const ordersRouter = require("./routes/orders");

const cartRouter = require("./routes/cart");
const path = require("path");
const Emitter = require('events');

const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

app.set("views", __dirname + "/resources/views");
app.use(expressLayout);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./config/passport")(passport);

// Event Emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport middelware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//golabal variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
//routes
app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/menuItems", menuItemsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB server connect"))
  .catch((e) => console.log("\tDB error\n", e));

const db = mongoose.connection;

db.on("error", (error) =>
  console.error("\tDatabase connection error:\n", error)
);
db.once("open", function() {
  console.log("MongDB connected");
});
app.get("/", (req, res) => res.send("Hello World!"));
const server = app.listen(port, () =>
  console.log(`MaklaExpress listening on port ${port}!`)
);

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  // Join
  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  console.log(' orderPlaced event triggerd');
  io.to("adminRoom").emit("orderPlaced", data);
});
