import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Tag } from "@/lib/models/tag";

export async function getTags() {
  await connectToDB();

  const tags = await Tag.aggregate([
    {
      // Crée une propriété "postsWithTag" dans chaque tag qui contient un tableau de tous les posts qui possède le tag en question
      $lookup: {
        from: "posts",
        foreignField: "tags",
        localField: "_id",
        as: "postsWithTag"
      }
    },
    {
      // Ajoute une propriété "postCount" dans chaque tag qui contient le nombre de posts qui possède ce tag
      // On utilise la méthode $size pour compter le nombre d'éléments dans le tableau "postsWithTag"
      $addFields: {
        postCount: { $size: "$postsWithTag" }
      }
    },
    {
      // On filtre les tags pour ne garder que ceux qui ont au moins un post
      // On utilise la méthode $match pour filtrer les documents avec $gt qui signifie "greater than" (plus grand que)
      $match: { postCount: { $gt: 0 } }
    },
    {
      // On trie les tags par ordre décroissant de postCount
      $sort: { postCount: -1 }
    },
    {
      // Ici, pour éviter de surcharger le client avec trop de données, on supprime la propriété "postsWithTag" de chaque tag
      $project: { postsWithTag: 0 }
    }
  ]);

  return tags;
}

// aggregate (agrégation) : méthode qui permet de retourner tous les documents d'une collection (ici un tableau avec des objets Tags) puis d'effectuer des tris, des filtres ou encore des jointures (documents liés par une liaison comme par exemple les tags et les posts ou les authors et les posts).

// ici $lookup, $addFields, $match, $sort, $project sont des étapes à la pipeline d'exécution de l'agrégation