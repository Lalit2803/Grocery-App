const {Router}=require("express");
const { authUser } = require("../middlewares/authUser");
const { authSeller } = require("../middlewares/authSeller");

const { placeOrderCOD, getUserOrders, getAllOrders, placeOrderStripe } = require("../controllers/order.controller");



const router=Router();


router.post("/cod",authUser,placeOrderCOD);
router.get("/user",authUser,getUserOrders);
router.get("/seller",authSeller,getAllOrders);
router.post("/stripe",authUser,placeOrderStripe);



module.exports=router;