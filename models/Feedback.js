import mongoose, { Schema, ObjectId } from "mongoose";

const Feedback = mongoose.model(
  "Feedback",
  new Schema(
    {
      id: { type: ObjectId },
      title: { type: String },
      content: { type: String },
      userId: { type: ObjectId },
      rating: { type: Number },
      productId: { type: ObjectId },
    },
    {
      autoCreate: false,
      autoIndex: true,
    }
  )
);

export default Feedback;
