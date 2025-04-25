
const Product=require("../models/Product")
const Order=require("../models/Order")
const stripe=require("stripe");
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = require("../config");
const User = require("../models/User");

// place order COD : /lps/order/cod
exports.placeOrderCOD=async(req,res)=>{
    try {
        const { items, address } = req.body;
        const { _id: userId } = req.user;
        if(!address || items.length===0){
            res.json({success:false,message:"Invalid data"})

        }
        // calculate Amount using items
        let amount=await items.reduce(async(acc,item)=>{
            const product=await Product.findById(item.product);
            return (await acc)+product.offerPrice*item.quantity

        },0)

        // add tax charge (2%)
        amount+=Math.floor(amount*0.02); 
        await Order.create({
            userId,items,amount,address,paymentType:"COD"

        })
        res.json({success:true,message:"Order Placed Successfully"})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }

}



// place order Stripe : /lps/order/stripe
exports.placeOrderStripe=async(req,res)=>{
    try {
        const { items, address } = req.body;
        const { _id: userId } = req.user;
        const { origin } = req.headers;
    
        if (!address || items.length === 0) {
          return res.json({ success: false, message: "Invalid data" });
        }
    
        const productData = [];
    
        // Calculate total amount
        let amount = await items.reduce(async (acc, item) => {
          const product = await Product.findById(item.product);
          productData.push({
            name: product.name,
            price: product.offerPrice,
            quantity: item.quantity,
          });
          return (await acc) + product.offerPrice * item.quantity;
        }, 0);
    
        // Add 2% tax
        amount += Math.floor(amount * 0.02);
    
        const order = await Order.create({
          userId,
          items,
          amount,
          address,
          paymentType: "Online",
        });
        // stripe gateway Initialize
        const stripeInstance = new stripe(STRIPE_SECRET_KEY);
    
        const line_items = productData.map((item) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.floor(item.price + item.price * 0.02) * 100, // cents
          },
          quantity: item.quantity,
        }));
    
        const session = await stripeInstance.checkout.sessions.create({
          line_items,
          mode: "payment",
          success_url: `${origin}/loader?next=my-orders`,
          cancel_url: `${origin}/cart`,
          metadata: {
            orderId: order._id.toString(),
            userId: userId.toString()  
          },
        });
    
        res.json({
          success: true,
          message: "Order Placed Successfully",
          url: session.url,
        });
      } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
      }

}

// stripe webhook to verify payment 
exports.stripeWebhook=async(req,res)=>{
    // stripe gateway Initialize

    const sig = req.headers["stripe-signature"];
    const stripeInstance = new stripe(STRIPE_SECRET_KEY);

  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.log("Webhook signature verification failed:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  
    // Handle the event
    switch(event.type){
        case "payment_intend.succeeded":{
            const paymentIntent=event.data.object;
            const paymentIntentId=session.metadata.orderId;

            // Getting session metadata
            const session=await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            })
            const {orderId,userId}=session.data[0].metadata;
            // mark payment as paid
            await Order.findByIdAndUpdate(orderId,{isPaid:true});
            // clear use cart
            await User.findByIdAndUpdate(userId,{cartItems:{}});
            break;
        }
        case "payment_intent.succeeded":{
            const paymentIntent=event.data.object;
            const paymentIntentId=session.metadata.orderId;

            // Getting session metadata
            const session=await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            })
            const {orderId}=session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;

        }
        default:
            console.error(`Unhandled event type ${svent.type}`)
            break;
    }
    res.status(200).json({ received: true });

}

//  Get Orders by User ID: /api/order/user

exports.getUserOrders = async (req, res)=>{
    try {
    const  userId = req.user._id;
    //console.log(userId)
    const orders = await Order.find({
        userId,
        $or: [{paymentType: "COD"}, {isPaid: true}]
    
    }).populate("items.product address").sort({createdAt:-1});
    
    res.json({ success: true, orders });
    
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

// get all orders(for seller / admin) : lps/order/seller
exports.getAllOrders = async (req, res)=>{
    try {
    
    const orders = await Order.find({
        $or: [{paymentType: "COD"}, {isPaid: true}]
    
    }).populate("items.product address").sort({createdAt:-1});
    
    res.json({ success: true, orders });
    
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}
    