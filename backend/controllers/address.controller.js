const Address = require("../models/Address");


// add address  :  /lps/address/add
exports.addAddress=async(req,res)=>{
    try {
        const{address}=req.body;
        await Address.create({...address,userId:req.user._id})
        res.json({success:true,message:"Address added successfully"})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }

}

// get address :  /lps/address/get
exports.getAddress=async(req,res)=>{
    try {
        const userId = req.user._id;
        const address=await Address.find({userId})
        res.json({success:true,message:"Address fetched successfully",address})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }

}