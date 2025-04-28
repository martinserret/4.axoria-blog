import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import { notFound } from "next/navigation";


export async function getPosts() {
  await connectToDB();

  // Récupère tous les posts existants
  const posts = await Post.find({}).populate({
    path: "author",
    select: "userName normalizedUserName"
  });
  return posts;
}

export async function getPost(slug) {
  await connectToDB();

  // Récupère un post via son slug et le populate permet d'enrichir notre résultat
  const post = await Post.findOne({ slug }).populate({
    path: "author",
    select: "userName normalizedUserName"
  }).populate({
    path: "tags",
    select: "name slug"
  });

  // Utilisation de la fonction notFound de next/navigation qui retourne une page 404 (not-found.jsx)
  if(!post) return notFound();

  return post;
}

export async function getUserPostsFromUserId(userId) {
  await connectToDB();

  const posts = await Post.find({ author: userId }).select("_id title slug");

  return posts;
}

export async function getPostsByTag(tagSlug) {
  await connectToDB();

  const tag = await Tag.findOne({ slug: tagSlug });

  if(!tag) return notFound(); // Utilisation de la fonction notFound de next/navigation qui retourne une page 404 (not-found.jsx)

  // Récupère tous les posts qui ont le tag en question
  // On utilise la méthode populate pour enrichir le résultat avec le nom de l'auteur
  // On utilise la méthode select pour ne récupérer que les champs nécessaires
  // On utilise la méthode sort pour trier les posts par date de création (createdAt) décroissante
  const posts = await Post.find({ tags: tag._id })
    .populate({
      path: "author",
      select: "userName"
    })
    .select("title slug coverImageUrl createdAt")
    .sort({ createdAt: -1 });

  return posts;
}


// Post.findOne({ slug }).populate : populate permet d'enrichir notre résultat. Dans notre cas, on utilise :
//  - path: "tags" : référence à notre collection tags dans mongodb
//  - select: "name slug" : champs de notre collection que l'on souhaite ajouter dans l'objet de retour (ici le name et le slug)


// server methods : ils sont fait pour être utilisés par les composants backend côté backend. Ils sont utiles le plus souvent pour la création de pages et ne sont utilisés que côté serveur.
//                  A la différence des serverActions, on ne retourne pas un texte ou un élément pour indiqué que ça n'a pas fonctionné mais directement une page


// Ici les try/catch sont implicites sur les fonctions serveurs et sont gérés par nextjs