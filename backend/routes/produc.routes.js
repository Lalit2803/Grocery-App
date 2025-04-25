const {Router}=require("express");
const { addProduct, productList, productById, changeStock } = require("../controllers/product.controller");
const upload = require("../middlewares/multer.middleware");
const { authSeller } = require("../middlewares/authSeller");


const router=Router();


router.post("/add",upload.array(["images"]),authSeller,addProduct);
router.get("/list",productList);
router.post("/id",productById);
router.post("/stock",authSeller,changeStock);


module.exports=router;