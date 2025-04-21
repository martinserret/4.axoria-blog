"use server";

import slugify from "slugify";
import { marked } from "marked"; // transforme le markdown en html
import { JSDOM } from "jsdom"; // purifie le html crée à partir du markdown des scripts qui pourraient engendrer des attaques
import createDOMPurify from "dompurify"; // purifie le html crée à partir du markdown des scripts qui pourraient engendrer des attaques

import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";

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