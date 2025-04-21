import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";

export async function getPosts() {
  try {
    await connectToDB();

    // Récupère tous les posts existants
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

    // Récupère un post via son slug
    const post = await Post.findOne({ slug }).populate({
      path: "tags",
      select: "name slug"
    });
    return post;
  } catch(error) {
    console.error("Error while fetch a post", error);
    throw new Error("Failed to fetch post");
  }
}


// Post.findOne({ slug }).populate : populate permet d'enrichir notre résultat. Dans notre cas, on utilise :
//  - path: "tags" : référence à notre collection tags dans mongodb
//  - select: "name slug" : champs de notre collection que l'on souhaite ajouter dans l'objet de retour (ici le name et le slug)
