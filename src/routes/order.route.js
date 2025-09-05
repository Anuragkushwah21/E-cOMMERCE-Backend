const express=require("express");
const authenticate = require("../middleware/authenticat.js");
const router=express.Router();
const orderController=require("../controllers/order.controller.js")

router.post("/",authenticate,orderController.createOrder);
router.get("/user",authenticate,orderController.orderHistory);
router.get("/:id",authenticate,orderController.findOrderById);
router.get("/user/:userId",authenticate,orderController.getOrdersByUser);



module.exports=router;