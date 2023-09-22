import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true }, // URL of user's avatar (required)
  allProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }], // Array of property ObjectIds associated with the user
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
