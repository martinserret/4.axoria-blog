import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";


export async function getPosts() {
  try {
    await connectToDB();

    // récupère tous les articles existants
    const posts = await Post.find({});
    return posts;
  } catch(error) {
    console.error("Error while fetch posts", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function getPost(slug) {
  try {
    await connectToDB();

    const post = await Post.findOne({ slug });
    return post;
  } catch(error) {
    console.error("Error while fetch a post", error);
    throw new Error("Failed to fetch post");
  }
}
