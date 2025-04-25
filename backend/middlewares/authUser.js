const userModel=require("../models/User")

const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const jwt=require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

exports.authUser=asyncHandler(async(req,res,next)=>{
    const cookie=req.cookies.token;
    if(!cookie || cookie==null){
        throw new ErrorHandler(401,"Please login to access this resource")
    }
    let decodedCookie=jwt.verify(cookie,JWT_SECRET);
// console.log(decodedCookie)
//  next();

// finding the user based on id
 let myUser=await userModel.findById(decodedCookie.id);
 req.user=myUser;
 // console.log(req.user)
next();

})