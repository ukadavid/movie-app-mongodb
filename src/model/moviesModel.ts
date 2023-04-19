import mongoose, { Schema, Document } from "mongoose";

export interface MovieDocument extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  userId: any;
}

const MovieSchema = new mongoose.Schema<MovieDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const MovieModel = mongoose.model<MovieDocument>("Movie", MovieSchema);
