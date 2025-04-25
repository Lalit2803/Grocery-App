const {Router}=require("express");
const { sellerLogin, isSellerAuth, sellerLogout } = require("../controllers/sellerController");
const { authSeller } = require("../middlewares/authSeller");


const router=Router();


router.post("/loginseller",sellerLogin);
router.get("/getcurrentseller",authSeller,isSellerAuth)
router.get("/logoutseller",authSeller,sellerLogout);


module.exports=router;