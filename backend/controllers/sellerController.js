
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const { generateTokenSeller } = require("../utils/jwt");
const { SELLER_EMAIL, SELLER_PASSWORD, NODE_ENV } = require("../config");

// ✅ Seller Login
exports.sellerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorHandler(400, "Email and password are required");
  }

  if (email === SELLER_EMAIL && password === SELLER_PASSWORD) {
    const token = await generateTokenSeller(email);

    res.cookie("sellerToken", token, {
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      secure: NODE_ENV === "production", // only secure in prod
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Seller login successful",
      seller: { email }, // You can return more info if needed
    });
  } else {
    throw new ErrorHandler(401, "Invalid seller credentials");
  }
});

// ✅ Seller Auth (frontend verification route)
exports.isSellerAuth = asyncHandler(async (req, res) => {
  // Ensure the auth middleware set this
  if (!req.seller || !req.seller.email) {
    throw new ErrorHandler(401, "Unauthorized access");
  }

  res.status(200).json({success: true,message: "Seller is authenticated",seller: {email: req.seller.email}});
});

// ✅ Seller Logout
exports.sellerLogout = asyncHandler(async (req, res) => {
  res.clearCookie("sellerToken",{
     httpOnly:true, // prevent javascript to access cookie
            secure:NODE_ENV==='production', // use secure cookie in production
            sameSite:NODE_ENV==="production" ? "none":"strict",// CSRF protection
  });

  res.status(200).json({success: true,message: "Seller logged out successfully",});
});
