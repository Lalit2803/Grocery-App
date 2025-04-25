const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const jwt=require("jsonwebtoken");
const { SELLER_EMAIL, JWT_SECRET_SELLER } = require("../config");


exports.authSeller=asyncHandler(async(req,res,next)=>{

    const cookie=req.cookies.sellerToken;
    if(!cookie || cookie==null){
        throw new ErrorHandler(401,"Please login to access this resource")
    }
    let decodedCookie=jwt.verify(cookie,JWT_SECRET_SELLER);
    //console.log(decodedCookie);
       
        if(decodedCookie.email===SELLER_EMAIL){
           
            req.seller = decodedCookie;
            
            next();
        }
        
        else{
            return res.json({success:false,message:"Not authorized"})

        }
        
    })
