const mongoose=require("mongoose");
const { MONGO_URL } = require(".");
exports.connectDB=async()=>{
    await mongoose.connect(MONGO_URL);
    console.log("Database is connected")
}