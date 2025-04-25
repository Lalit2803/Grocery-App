const User = require("../models/User");



// add product:  /cart/update
exports.updateCart = async (req, res) => {
    //console.log('Body:', req.user);
    try {
        const { cartItems } = req.body;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId,{cartItems}, { new: true });
        res.json({success:true,message:"Cart Updated"})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }

   

};

