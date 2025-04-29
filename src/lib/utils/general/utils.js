export function areTagsSimilar(userTagsArray, DBTagsArray) {
  if(userTagsArray.length !== DBTagsArray.length) return false;

  // On trie les tableaux pour comparer les tags dans le même ordre
  const sortedUserTagsArray = [...userTagsArray].sort();
  const sortedDBTagsArray = DBTagsArray.map(tag => tag.name).sort(); // Le tableau de tags de la DB est un tableau d'objets, on doit donc récupérer le nom du tag pour le comparer

  return sortedUserTagsArray.every((tag, i) => tag === sortedDBTagsArray[i]); // Compare les tags un par un, si ils sont identiques, retourne true, sinon false
}