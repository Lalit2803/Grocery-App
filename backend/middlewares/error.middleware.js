const ErrorHandler = require("../utils/errorHandler");

exports.error=(err,req,res,next)=>{
    if(err.name==="ValidationError"){
        let message= Object.values(err.errors).map((ele)=>ele.message);
        err=new ErrorHandler(400,message);
    }


    if(err.name==="JsonWeTokenError"){
        let message= "Please login first"
        err=new ErrorHandler(400,message);
    }

    if(err.name==="CastError"){
        let message= "Please enter valid id"
        err=new ErrorHandler(400,message);
    }



    // gloal error handler
    err.message=err.message|| "Internal Service Error",
    err.statusCode=err.statusCode || 500,
    res.status(err.statusCode).json({
        success:false ,message:err.message ,errObject:err,lineNo:err.stack
    })
}