// to generate custom define error
class ErrorHandler extends Error{
    constructor(statusCode,message){
        super(),
        this.message=message,
        this.statusCode=statusCode;
    }

}
module.exports=ErrorHandler;