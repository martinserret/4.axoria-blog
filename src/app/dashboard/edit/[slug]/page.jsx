import { Types } from "mongoose";

import { getPostForEdit } from "@/lib/serverMethods/blog/postMethods";
import ClientEditForm from "./(components)/ClientEditForm";

export default async function page({ params }) {
  const { slug } = await params;
  const post = await getPostForEdit(slug);

  // Généralement cette méthode est utilisée dans plusieurs endroits de l'application, il est donc préférable de la mettre dans un fichier dans le dossier utils
  const serializablePost = JSON.parse(JSON.stringify(post, (key, value) => value instanceof Types.ObjectId ? value.toString() : value));
    
  return (
    <ClientEditForm post={serializablePost}/>
  );
}


// Ici il est important de faire attention à la sérialisation des données. En effet, nous souhaitons passer des données de composant côté serveur à un composant côté client.
// Pour passer des données serveur vers client, il faut que ces données soient sérialiable. Il faut donc les transformer en JSON avant de les passer au composant côté client.
// On utilise la méthode JSON.stringify pour transformer l'objet "post" en chaîne de caractères JSON, puis on utilise JSON.parse pour le transformer en objet JavaScript.
// Cependant, dans l'objet "post", il y a des champs de type ObjectId qui ne peuvent pas être sérialisés directement en JSON. Il faut donc les transformer en chaîne de caractères avant de les passer au composant côté client.
// Pour cela on vérifie si la valeur est une instance de Types.ObjectId et on utilise la méthode toString() pour la transformer en chaîne de caractères.