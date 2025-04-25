const jwt=require("jsonwebtoken");
const asyncHandler=require("express-async-handler");
const { JWT_SECRET, JWT_SECRET_SELLER } = require("../config");
exports.generateToken=asyncHandler(async(id)=>{
    return  jwt.sign({id},JWT_SECRET,{expiresIn:"1d"})
})

exports.generateTokenSeller=asyncHandler(async(email)=>{
    return  jwt.sign({email},JWT_SECRET_SELLER,{expiresIn:"1d"})
})