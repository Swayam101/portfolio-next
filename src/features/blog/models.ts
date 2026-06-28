import mongoose, { Schema } from "mongoose";
import type { YamlBlogPost } from "@/features/blog/types";

const YamlBlogPostSchema = new Schema<YamlBlogPost>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    yaml: { type: String, required: true },
    yamlHindi: { type: String },
    yamlHinglish: { type: String },
    seriesSlug: { type: String, index: true },
    seriesDescription: { type: String },
    active: { type: Boolean, default: true, index: true },
    tags: { type: String },
    readTime: { type: String },
    date: { type: String },
    category: { type: String, index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
  },
  { timestamps: true }
);

export const YamlBlogPostModel =
  mongoose.models.YamlBlogPost ||
  mongoose.model<YamlBlogPost>("YamlBlogPost", YamlBlogPostSchema);
