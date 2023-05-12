import mongoose, { Schema, ObjectId } from "mongoose";

const Product = mongoose.model(
  "Product",
  new Schema(
    {
      id: { type: ObjectId },
      name: {
        type: String,
        required: true,
      },
      price: { type: Number, required: true },
      rating: { type: Number, required: true },
      category: { type: String, required: true },
      description: { type: String },
      imgUrl: { type: String, required: true },
      slug: { type: String, required: true },
    },
    {
      autoCreate: false,
      autoIndex: true,
    }
  )
);

export default Product;
