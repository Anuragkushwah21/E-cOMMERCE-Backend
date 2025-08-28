const express=require("express");
const authenticate = require("../middleware/authenticat");
const router=express.Router();
const cartController=require("../controllers/cart.controller")

// GET: /api/cart
router.get("/", authenticate, cartController.findUserCart);

// PUT: /api/cart/add
router.put("/add", authenticate, cartController.addItemToCart);


module.exports=router;