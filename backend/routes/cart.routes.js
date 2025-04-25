const {Router}=require("express");
const { authUser } = require("../middlewares/authUser");
const { updateCart } = require("../controllers/cart.controller");


const router=Router();


router.post('/update',authUser,updateCart);


module.exports=router;