import mongoose, { Schema, ObjectId } from "mongoose";

const Category = mongoose.model(
  "Category",
  new Schema(
    {
      id: { type: ObjectId },
      name: {
        type: String,
        required: true,
      },
    },
    {
      autoCreate: false,
      autoIndex: true,
    }
  )
);

export default Category;
