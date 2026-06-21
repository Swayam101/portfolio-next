import mongoose, { Schema } from "mongoose";
import type { YamlBlogPost } from "@/types/blog";

const YamlBlogPostSchema = new Schema<YamlBlogPost>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    yaml: { type: String, required: true },
    seriesSlug: { type: String, index: true },
    seriesDescription: { type: String },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const YamlBlogPostModel =
  mongoose.models.YamlBlogPost ||
  mongoose.model<YamlBlogPost>("YamlBlogPost", YamlBlogPostSchema);
