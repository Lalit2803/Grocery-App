const productModel=require("../models/Product");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const { uploadOnCloudinary } = require("../utils/uploadOnCloudinary");




// add product:  /product/add
exports.addProduct = asyncHandler(async (req, res) => {
  const productData = JSON.parse(req.body.productData); // parse JSON from string
  const { name, description, price, offerPrice, category } = productData;

  const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
  const uploadResults = await Promise.all(uploadPromises);
  const imageUrls = uploadResults.map(result => result.secure_url);

  const newProduct = await productModel.create({
      name,
      description,
      price,
      offerPrice,
      image: imageUrls,
      category,
      inStock:true
  });

  res.status(201).json({
      success: true,
      message: "Product added successfully",
      newProduct
  });
});   


// get product:  /product/list
exports.productList=asyncHandler(async(req,res)=>{
    let product = await productModel.find();

  res.status(200).json({
      success: true,
      count: product.length,
      message: "allProduct fetched successfully",
      product,
    });
  

})

// get single  product:  /product/id
exports.productById=asyncHandler(async(req,res)=>{
    let {id}=req.params;
    let product = await productModel.findById(id);
      if (!product) {
        throw new ErrorHandler(404, "No product find");
      }
      res.status(200).json({
          success: true,
          message: "product fetched successfully",
          product,
        });
    
})

// change product stock:  /product/stock
exports.changeStock=asyncHandler(async(req,res)=>{
    let {id,inStock}=req.body;
    let product = await productModel.findByIdAndUpdate(id,{inStock});

    res.status(200).json({
        success: true,
        message: "inStock update successfully",
        product,
      });
    
})