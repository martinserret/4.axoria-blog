"use server";

import slugify from "slugify";
import { marked } from "marked"; // transforme le markdown en html
import { JSDOM } from "jsdom"; // purifie le html crée à partir du markdown des scripts qui pourraient engendrer des attaques
import createDOMPurify from "dompurify"; // purifie le html crée à partir du markdown des scripts qui pourraient engendrer des attaques

import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";

// Création d'un DOM et dans objet window dans le backend. Cette étape est essentielle car les méthodes utilisées pour
// nettoyer le HTML utilise des méthodes et des propriétés disponibles dans l'objet global window
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export async function addPost(formData) {
  const { title, markdownArticle, tags } = Object.fromEntries(formData);

  try {
    await connectToDB();

    // Gestion des tags
    const tagNamesArray = JSON.parse(tags);

    // Promise.all permet de lancer toutes les promises parallèlement et ainsi gagner en performance
    // plutôt que d'attendre qu'une promise soit terminée pour lancer la suivante
    const tagIds = await Promise.all(tagNamesArray.map(async (tagName) => {
      
      // Tag déjà normalisé en front mais il est très important de le refaire dans le backend
      const normalizedTagName = tagName.trim().toLowerCase();
      let tag = await Tag.findOne({ name: normalizedTagName });

      if(!tag) {
        tag = await Tag.create({ name: normalizedTagName, slug: slugify(normalizedTagName, { strict: true }) });
      }

      // Ici il est important de retourner l'id du tag créé 
      return tag._id;
    }));

    //Gestion du markdown
    let markdownHTMLResult = marked(markdownArticle);
    markdownHTMLResult = DOMPurify.sanitize(markdownHTMLResult); // Purification du HTML des scripts malicieux

    // Création d'un post via un modèle
    const newPost = new Post({
      title,
      markdownArticle,
      markdownHTMLResult,
      tags: tagIds
    });

    // Sauvegarde du document
    const savedPost = await newPost.save();
    console.log("Post saved successfully");

    return { success: true, slug: savedPost.slug };
  } catch(error) {
    console.log("Error while creating the post: ", error);
    throw new Error(error.message || "An error occurred while creating the post");
  }
}

// await Promise.all(): permet de lancer toutes les promises parallèlement et ainsi gagner en performance plutôt que d'attendre qu'une promise soit terminée pour lancer la suivante
// les promises sont compliquées en JS, il est important de bien les comprendre et de les travailler

// Pour tester une attaque xss, commentez la ligne "markdownHTMLResult = DOMPurify.sanitize(markdownHTMLResult);", 
// créez un nouvel article avec comme contenu : <img src="x" onerror="alert('XSS')" style="display: none;" />
// Lorsque vous ouvrez cet article, du javascript est lancé en arrière plan (ici affichage d'une alerte)