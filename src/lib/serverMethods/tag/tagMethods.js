import slugify from "slugify";

import { Tag } from "@/lib/models/tag";

export async function findOrCreateTag(tagName) {
  const normalizedTagName = tagName.trim().toLowerCase();
  let tag = await Tag.findOne({ name: normalizedTagName });

  // const tagSlug = slugify(tagName, { lower: true, strict: true });
  // let tag = await Tag.findOne({ slug: tagSlug });

  if(!tag) {
    tag = await Tag.create({ name: normalizedTagName, slug: slugify(normalizedTagName, { strict: true }) });
  }

  return tag._id;
}