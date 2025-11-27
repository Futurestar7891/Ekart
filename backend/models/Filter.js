import mongoose from "mongoose";

const categoryFilterSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Dynamic filter keys
    filters: {
      type: Map,
      of: [String], 
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("CategoryFilter", categoryFilterSchema);
