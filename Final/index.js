const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");

// Routers
const orderRouter = require("./routes/Order.js");
const productRouter = require("./routes/Product.js");
const userRouter = require("./routes/User.js");
const cartRouter = require("./routes/Cart.js");
const frontendRouter = require("./routes/Frontend.js");

app.use(express.static("public")); // to read static files (css, js, img)
app.use(express.json()); // to read req.body
app.use(express.urlencoded({ extended: true })); // to read req.body
app.use(cookieParser()); // For parsing cookies
app.set("view engine", "ejs"); // to set view engine to ejs

app.use("/", orderRouter);
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", cartRouter);
app.use("/", frontendRouter);

app.get("/logout", (req, res) => {
  res.cookie("authToken", "", { maxAge: 1 });
  res.redirect("/");
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(3000, () => {
  connectDB();
  console.log(`Example app listening on port 3000`);
});
