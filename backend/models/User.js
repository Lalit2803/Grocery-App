const { Schema, model } = require("mongoose");
const bcrypt=require("bcrypt")

const userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartItems:{type:Object,default:{}}
},
{ timestamps:true,minimize:false}
)


// hashing the password
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    let salt=await bcrypt.genSalt(10);
    let hashedPassword=await bcrypt.hash(this.password,salt);
    this.password=hashedPassword;
    
})

// matching the password
userSchema.methods.comparePassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
    
}

module.exports=model("User",userSchema);