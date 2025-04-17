"use server";

import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";

export async function addPost(formData) {
  const { title, markdownArticle } = Object.fromEntries(formData);
  console.log(title, markdownArticle);
  console.log("here");

  try {
    await connectToDB();

    const newPost = new Post({
      title,
      markdownArticle
    });

    const savedPost = await newPost.save();
    console.log("Post saved successfully");

    return { success: true, slug: savedPost.slug };
  } catch(error) {
    console.log("Error while creating the post: ", error);

    throw new Error(error.message || "An error occurred while creating the post");
  }
}