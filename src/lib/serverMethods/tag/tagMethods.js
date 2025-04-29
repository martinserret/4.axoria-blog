import slugify from "slugify";

import { Tag } from "@/lib/models/tag";

export async function findOrCreateTag(tagName) {
  const tagSlug = slugify(tagName, { lower: true, strict: true });
  
  let tag = await tagName.findOne({ slug: tagSlug });
  if(!tag) {
    tag = await Tag.create({ name: tagName, slug: tagSlug });
  }

  return tag._id;
}