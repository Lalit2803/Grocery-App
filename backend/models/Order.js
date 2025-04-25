const { Schema, model } = require("mongoose");


const orderSchema=new Schema({
    userId:{type:String,required:true,ref:'User'},
    items:[{
        product:{type:String,required:true,ref:'Product'},
        quantity:{type:Number,required:true}
    }],
    amount:{type:Number,required:true},
    address:{type:String,required:true,ref:"Address"},
    status:{type:String,required:true,default: "Pending",ref:"Order Placed"},
    paymentType:{type:String,required:true},
    isPaid:{type:Boolean,required:true,default:false}
},
{ timestamps:true}
)

module.exports=model("Order",orderSchema);