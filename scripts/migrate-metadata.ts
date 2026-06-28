/**
 * One-time migration script: extracts TAGS, READ_TIME, DATE, SEO_TITLE,
 * SEO_DESCRIPTION, OG_IMAGE from stored YAML into separate MongoDB fields,
 * then strips them from the YAML string.
 *
 * Usage:
 *   npx tsx scripts/migrate-metadata.ts
 */

import mongoose from "mongoose";
import yaml from "js-yaml";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI env var is required");
  process.exit(1);
}

const METADATA_KEYS = ["TAGS", "READ_TIME", "DATE", "SEO_TITLE", "SEO_DESCRIPTION", "OG_IMAGE"];

const schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    yaml: { type: String, required: true },
    seriesSlug: String,
    seriesDescription: String,
    active: { type: Boolean, default: true },
    tags: String,
    readTime: String,
    date: String,
    category: String,
    seoTitle: String,
    seoDescription: String,
    ogImage: String,
  },
  { timestamps: true }
);

const Model = mongoose.models.YamlBlogPost || mongoose.model("YamlBlogPost", schema);

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  const docs = await Model.find({}).lean();
  console.log(`Found ${docs.length} post(s)`);

  for (const doc of docs) {
    const alreadyMigrated = doc.tags || doc.readTime || doc.date || doc.seoTitle || doc.seoDescription || doc.ogImage;
    if (alreadyMigrated) {
      console.log(`[${doc.slug}] Already has metadata fields — skipping`);
      continue;
    }

    const parsed = yaml.load(doc.yaml) as Record<string, unknown>;
    const metadata: Record<string, string> = {};
    for (const key of METADATA_KEYS) {
      if (typeof parsed[key] === "string") {
        const field = key === "SEO_TITLE" ? "seoTitle"
          : key === "SEO_DESCRIPTION" ? "seoDescription"
          : key === "OG_IMAGE" ? "ogImage"
          : key === "READ_TIME" ? "readTime"
          : key.toLowerCase();
        metadata[field] = parsed[key] as string;
      }
    }

    for (const key of METADATA_KEYS) {
      delete parsed[key];
    }
    const cleanedYaml = yaml.dump(parsed, { lineWidth: -1, quotingType: '"', forceQuotes: false });

    await Model.updateOne(
      { _id: doc._id },
      { $set: { ...metadata, yaml: cleanedYaml } }
    );

    console.log(`[${doc.slug}] Migrated:`, Object.keys(metadata));
  }

  console.log("Migration complete");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
