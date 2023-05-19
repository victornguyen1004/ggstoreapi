import mongoose, { Schema, ObjectId } from "mongoose";

const Customer = mongoose.model(
  "Customer",
  new Schema(
    {
      id: { type: ObjectId },
      name: {
        type: String,
        required: true,
      },
      imgUrl: { type: String, required: true },
      link: { type: String, required: true },
      isActive: { type: Boolean, required: true },
    },
    {
      autoCreate: false,
      autoIndex: true,
    }
  )
);

export default Customer;
