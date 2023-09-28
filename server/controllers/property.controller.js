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
  // Destructuring request query parameters
  const {
    _end, // Pagination: End index (จำนวนรายการที่จะดึงข้อมูล)
    _order, // Sorting order: 'ASC' or 'DESC'
    _start, // Pagination: Start index (starting from 0)
    _sort, // Property to sort by (e.g., 'title')
    title_like = "", // Search query for property title (default is empty string)
    propertyType = "", // Filter by property type (default is empty string)
  } = req.query;

  // Initialize an empty query object to filter properties
  const query = {};

  // Check if a property type is provided in the query
  if (propertyType !== "") {
    query.propertyType = propertyType; // Add propertyType filter to the query
  }

  // Check if a title search query is provided
  if (title_like) {
    // Using regular expression for a case-insensitive search on the title field
    query.title = { $regex: title_like, $options: "i" };
  }

  try {
    // Count the total number of properties that match the query
    const count = await Property.countDocuments({ query });

    // Retrieve properties based on the query, with pagination and sorting
    const properties = await Property.find(query)
      .limit(_end) // Limit the number of results to retrieve
      .skip(_start) // Skip the specified number of results
      .sort({ [_sort]: _order }); // Sort properties by the specified property

    // Set response headers to provide total count for pagination in the frontend
    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    // Send the properties as a JSON response
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyDetail = async (req, res) => {
  const { id } = req.params;
  const propertyExists = await Property.findOne({ _id: id }).populate(
    "creator"
  );

  if (propertyExists) {
    res.status(200).json(propertyExists);
  } else {
    res.status(404).json({ message: "Property not found" });
  }
};

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

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, propertyType, location, price, photo } =
      req.body;
    //   Re-upload photo
    const photoUrl = await cloudinary.uploader.upload(photo);

    await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    );
    res.status(200).json({ message: "Property uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params; // Extract the 'id' parameter from the request

    //   Find the property to delete by its '_id'. Populate 'creator' to get user info
    const propertyToDelete = await Property.findById({ _id: id }).populate(
      "creator"
    );

    if (!propertyToDelete) throw new Error("Property not found");

    const session = await mongoose.startSession(); // Start a new database session
    session.startTransaction(); // Start a new transaction within the session

    propertyToDelete.deleteOne({ session }); //  Delete the property.

    //  Remove the property reference from user's 'allProperties'
    propertyToDelete.creator[0].allProperties.pull(propertyToDelete);

    // Save the user after removing the property reference
    await propertyToDelete.creator[0].save({ session });

    await session.commitTransaction(); // Commit the transaction

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};
