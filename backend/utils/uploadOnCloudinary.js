const v2 = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");
const { unlinkSync } = require("fs");

const uploadOnCloudinary = asyncHandler(async (localFilePath) => {
  if (!localFilePath) return null;
  let response = await v2.uploader.upload(localFilePath, {
    folder: "grocery",
    resource_type: "auto",
  });

  unlinkSync(localFilePath);

  return response;
});

const deleteFromCloudinary = asyncHandler(async (id) => {
  let response = await v2.uploader.destroy(id);
 // console.log(response);
  return response;
});

module.exports = { deleteFromCloudinary, uploadOnCloudinary };

// https://res.cloudinary.com/dmqwvd39n/image/upload/v1742553550/taskify/zuforcqhhvlfawrtxbzx.jpg