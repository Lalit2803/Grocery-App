const userModel=require("../models/User");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const { generateToken } = require("../utils/jwt");


// register user  /lps/user/register
exports.register=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new ErrorHandler(409,"Missing details");

    }
    let existUser=await userModel.findOne({email});
    if(existUser){
        throw new ErrorHandler(409,"User already exist with this email ,please login instead");
    }
    let user=await userModel.create({name,email,password});
    const token= await generateToken(user._id);
    res.cookie("token",token,{maxAge:1*60*60*1000,httpOnly:true})

    res.status(200).json({success:true,message:"User Registered successfully",user})
})

// login password   /lps/user/login
exports.login=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;
    let existUser=await userModel.findOne({email});
    if(!existUser){
        throw new ErrorHandler(409,"register first with this email");

    }
    let match=await existUser.comparePassword(password);
    if(!match){
        throw new ErrorHandler(409,"Incorrect Password");
    }
    const token= await generateToken(existUser._id);
    res.cookie("token",token,{maxAge:1*60*60*1000,httpOnly:true})

    res.status(200).json({success:true,message:"User Login successfully",existUser})

})

exports.logOutUser=asyncHandler(async(req,res)=>{
    res.clearCookie("token","",{maxAge:0});
    
res.status(200).json({ success: true, message: "user logged out" });
    
})

exports.getCurrentUser=asyncHandler(async(req,res)=>{
    // let user=await userModel.findById(req.user._id)
    // res.status(200).json({success:true,user})
    //const {userId}=req.body;
    let user=await userModel.findById(req.user._id).select("-password");
    res.status(200).json({success:true,user})

})