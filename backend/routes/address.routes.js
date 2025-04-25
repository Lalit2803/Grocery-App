const {Router}=require("express");
const { authUser } = require("../middlewares/authUser");
const { addAddress, getAddress } = require("../controllers/address.controller");


const router=Router();


router.post('/add',authUser,addAddress);
router.get('/get',authUser,getAddress);


module.exports=router;