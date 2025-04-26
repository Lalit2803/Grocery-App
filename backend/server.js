const express =require ("express");
const { PORT } = require("./config");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const { error } = require("./middlewares/error.middleware");
const { connectDB } = require("./config/db");
const userRoutes=require("./routes/User.routes");
const sellerRoutes=require("./routes/seller.routes")
const productRoutes=require("./routes/produc.routes")

const addressRoutes=require("./routes/address.routes")

const cartRoutes=require("./routes/cart.routes")
const orderRoutes=require("./routes/order.routes");
const { stripeWebhook } = require("./controllers/order.controller");
connectDB();
const app=express();
//allowed multiple origins
// const allowedOrigins=["http://localhost:5173"]

app.post('/stripe',express.raw({type:'application/json'},stripeWebhook))

// middleware configuration

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Make sure this matches your frontend origin
  credentials: true,
}));
app.use("/lps/user",userRoutes)
app.use("/lps/seller",sellerRoutes)
app.use("/lps/products",productRoutes)
app.use("/lps/cart",cartRoutes)
app.use("/lps/address",addressRoutes)
app.use("/lps/order",orderRoutes)

app.get("/", (req, res) => {
  res.send("🚀 Grocery API is working!");
});

app.use(error)
app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Port is listening at ${PORT}`)
})