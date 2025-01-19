const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  authorizeAdmin,
  authorizeUser,
} = require("../middlewares/auth");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/order");

router.get("/", (req, res) => {
  res.render("./home", { title: "Home" });
});

router.get("/aboutus", (req, res) => {
  res.render("./aboutus", { title: "About us" });
});

router.get("/signin", (req, res) => {
  res.render("./signin", { title: "Sign in" });
});

router.get("/signup", (req, res) => {
  res.render("./signup", { title: "Signup" });
});

router.get("/admin", authenticateToken, authorizeAdmin, (req, res) => {
  res.render("./admin/dashboard.ejs", { title: "Admin" });
});

router.get(
  "/admin/users",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    res.render("./admin/users.ejs", {
      title: "Admin",
      users: await User.find(),
    });
  }
);

router.get(
  "/admin/edit-users/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    res.render("./admin/editUser.ejs", {
      title: "Admin",
      user: await User.findById(req.params.id),
    });
  }
);

router.get(
  "/admin/products",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    res.render("./admin/products.ejs", {
      title: "Admin",
      products: await Product.find(),
    });
  }
);

router.get(
  "/admin/product/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    res.render("./admin/editproduct.ejs", {
      title: "Admin",
      product: await Product.findById(req.params.id),
    });
  }
);

router.get("/user/:id", authenticateToken, authorizeUser, async (req, res) => {
  let user = null;
  try {
    user = await User.findById(req.params.id).populate({
      path: "cart.items.product",
      select: "name category price quantity imageUrl",
    });

    res.render("./user/home.ejs", {
      title: "User",
      user,
      products: await Product.find(),
    });
  } catch (error) {
    if (!user) {
      return res.redirect("/");
    }
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get(
  "/user/:id/profile",
  authenticateToken,
  authorizeUser,
  async (req, res) => {
    try {
      res.render("./user/profile.ejs", {
        title: "User",
        user: await User.findById(req.params.id),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/user/:id/payment",
  authenticateToken,
  authorizeUser,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate({
        path: "cart.items.product",
        select: "name category price quantity imageUrl",
      });

      if (!user) {
        return res.redirect("/");
      }

      // Render the user home page with user details, products, and cart
      res.render("./user/payment.ejs", {
        title: "User",
        user,
        products: await Product.find(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/user/:id/history",
  authenticateToken,
  authorizeUser,
  async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(req.params.id);

    try {
      // Fetch the orders of the user and populate product details in each item
      const orders = await Order.find({ user: userId })
        .populate({
          path: "items.product", // Populate the product details for each item
          select: "name category price description imageUrl", // Specify the fields you want to include from the Product model
        })
        .sort({ createdAt: -1 }); // Optionally sort by creation date

      res.render("./user/history.ejs", {
        title: "User",
        user,
        orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
