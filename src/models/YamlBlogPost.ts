import mongoose, { Schema } from "mongoose";

const YamlBlogPostSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  yaml: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const YamlBlogPostModel = 
  mongoose.models.YamlBlogPost || mongoose.model("YamlBlogPost", YamlBlogPostSchema);
