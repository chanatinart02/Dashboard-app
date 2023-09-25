import mongoose from "mongoose";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).limit(req.query._end);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyDetail = async (req, res) => {};

const createProperty = async (req, res) => {
  try {
    const { title, description, propertyType, location, price, photo, email } =
      req.body;

    // Start a Mongoose session for transaction
    // session allows multiple database operations to be performed as a single unit of work.
    const session = await mongoose.startSession();
    session.startTransaction();

    // Find the user by their email using the started session
    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    // User found
    // Upload the photo to a cloud storage
    const photoUrl = await cloudinary.uploader.upload(photo);

    // Create a new property using the provided data
    const newProperty = await Property.create({
      title,
      description,
      propertyType,
      location,
      price,
      photo: photoUrl.url,
      creator: user._id, //connect between user and property
    });

    // Update the user's list of properties
    user.allProperties.push(newProperty._id);
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({ message: "Property created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {};
const deleteProperty = async (req, res) => {};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};
