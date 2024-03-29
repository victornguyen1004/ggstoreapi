import mongoose, { Schema, ObjectId } from "mongoose";
import isEmail from "validator/lib/isEmail.js";

export default mongoose.model(
  "User",
  new Schema({
    id: { type: ObjectId },
    name: {
      type: String,
      required: true, // NOT NULL
      validate: {
        validator: (value) => value.length > 3,
        message: "Username must be at least 3 characters",
      },
    },
    email: {
      type: String,
      validate: {
        validator: isEmail,
        message: "Email is in incorrect format",
      },
    },
    password: {
      //hashed/encrypted password
      type: String,
      required: true,
      // validate ??
    },
    imgUrl: { type: String, required: false },
    balance: { type: Number, required: true },
  })
);
