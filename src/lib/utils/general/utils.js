import slugify from "slugify";
import { Post } from "@/lib/models/post";

export function areTagsSimilar(userTagsArray, DBTagsArray) {
  if(userTagsArray.length !== DBTagsArray.length) return false;

  // On trie les tableaux pour comparer les tags dans le même ordre
  const sortedUserTagsArray = [...userTagsArray].sort();
  const sortedDBTagsArray = DBTagsArray.map(tag => tag.name).sort(); // Le tableau de tags de la DB est un tableau d'objets, on doit donc récupérer le nom du tag pour le comparer

  return sortedUserTagsArray.every((tag, i) => tag === sortedDBTagsArray[i]); // Compare les tags un par un, si ils sont identiques, retourne true, sinon false
}

export async function generateUniqueSlug(title) {
  let slugCandidate = slugify(title, { lower: true, strict: true });
  
  let slugExists = await Post.findOne({ slug: slugCandidate });
      
  let counter = 1; 
  while(slugExists) {
    // Vérifie que le slug n'existe pas, si c'est le cas, ajoute un chiffre à la fin pour le différencier. 
    // Ce chiffre s'incrémente si il existe déjà un slug avec un chiffre à la fin 
    slugCandidate = `${slugCandidate}-${counter}`;
    slugExists = await Post.findOne({ slug: slugCandidate });
    counter++;
  }
  
  return slugCandidate;
}
