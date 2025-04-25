const { Schema, model } = require("mongoose");


const productSchema=new Schema({
    name:{type:String,required:true},
    description:{type:Array,required:true},
    price:{type:Number,required:true},
    offerPrice:{type:Number,required:true},
    image:{type:Array,required:true},
    category:{type:String,required:true},
    inStock:{type:Boolean,required:true}
},
{ timestamps:true}
)

module.exports=model("Product",productSchema);