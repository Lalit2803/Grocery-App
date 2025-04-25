const {Router}=require("express");
const { register, login, logOutUser, getCurrentUser } = require("../controllers/User.controller");
const { authUser } = require("../middlewares/authUser");
const router=Router();

router.post("/register",register);
router.post("/login",login);
router.get("/getcurrentuser",authUser,getCurrentUser)
router.get("/logout",authUser,logOutUser);


module.exports=router;