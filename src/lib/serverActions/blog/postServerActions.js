"use server";

import { revalidatePath } from "next/cache";

import { marked } from "marked"; // transforme le markdown en html
import { JSDOM } from "jsdom"; // purifie le html crée à partir du markdown des scripts qui pourraient engendrer des attaques
import createDOMPurify from "dompurify"; // purifie le html crée à partir du markdown des scripts qui pourraient engendrer des attaques

import Prism from "prismjs"; // Librairie de coloration syntaxique (entoure le contenu d'éléments <span>)
import { markedHighlight } from "marked-highlight"; // Plugin permettant à la librairie marked d'utiliser Prism
import "prismjs/components/prism-markup"; // Permet d'entourer les éléments html de <span> spécifiques au html
import "prismjs/components/prism-css"; // Permet d'entourer les éléments css de <span> spécifiques au css
import "prismjs/components/prism-javascript"; // Permet d'entourer les éléments javascript de <span> spécifiques au javascript

import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";

import { sessionInfo } from "@/lib/serverMethods/session/sessionMethods";
import AppError from "@/lib/utils/errorHandling/customError";

import slugify from "slugify";
import sharp from "sharp"; // Librairie permettant de manipuler les images (redimensionner, compresser, etc.)
import crypto from "crypto"; // Librairie permettant de générer un nom de fichier unique pour éviter les conflits de nom (vient directement de NodeJS)

// Création d'un DOM et dans objet window dans le backend. Cette étape est essentielle car les méthodes utilisées pour
// nettoyer le HTML utilise des méthodes et des propriétés disponibles dans l'objet global window
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export async function addPost(formData) {
  const { title, markdownArticle, tags, coverImage } = Object.fromEntries(formData);

  try {

    if(typeof title !== "string" || title.trim().length < 3) {
      throw new AppError("Invalid data");
    }

    if(typeof markdownArticle !== "string" || markdownArticle.trim().length === 0) {
      throw new AppError("Invalid data");
    }

    await connectToDB();

    // L'utilisateur doit être connecté pour créer un article
    const session = await sessionInfo();
    if(!session.success) {
      throw new AppError("You must be logged in to create a post");
    }


    //Gestion de l'upload d'image
    if(!coverImage || !(coverImage instanceof File)) {
      throw new AppError("Invalid data");
    }
    
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if(!validImageTypes.includes(coverImage.type)) {
      throw new AppError("Invalid data");
    }

    const imageBuffer = Buffer.from(await coverImage.arrayBuffer()); // Transformation de l'image en données brutes pour la manipuler
    const { width, height } = await sharp(imageBuffer).metadata(); // Récupération de la largeur et de la hauteur de l'image
    if(width > 1280 || height > 720) {
      throw new AppError("Invalid data");
    }

    const uniqueFileName = `${crypto.randomUUID()}_${coverImage.name}`; // Création d'un nom de fichier unique pour éviter les conflits de nom
    const uploadUrl = `${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_ZONE}/${uniqueFileName}`; // URL de mise en ligne de l'image sur BunnyCDN (pour le stockage)
    const publicImageUrl = `${process.env.BUNNY_STORAGE_PULL_ZONE}/${uniqueFileName.trim()}`; // Récupération de l'image via la pull zone la plus proche de l'utilisateur sur BunnyCDN (pour la diffusion)

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "AccessKey": process.env.BUNNY_STORAGE_API_KEY,
        "Content-type": "application/octet-stream" // mode de mise en ligne de l'image
      },
      body: imageBuffer // Image brut
    });

    if(!response.ok) {
      throw new AppError(`Error while uploading the image : ${response.statusText}`);
    }
    
    // Gestion des tags
    if(typeof tags !== "string") {
      throw new AppError("Invalid data");
    }
    
    const tagNamesArray = JSON.parse(tags);
    
    if(!Array.isArray(tagNamesArray)) {
      throw new AppError("Tags must be a valid array");
    }

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

    // Option marked pour highlight le code
    marked.use(
      markedHighlight({
        highlight: (code, language) => {
          const validLanguage = Prism.languages[language] ? language : "plaintext"; // vérifie si le langage existe sinon retourne "plaintext"
          return Prism.highlight(code, Prism.languages[validLanguage], validLanguage);
        }
      })
    );

    let markdownHTMLResult = marked(markdownArticle);
    markdownHTMLResult = DOMPurify.sanitize(markdownHTMLResult); // Purification du HTML des scripts malicieux

    // Création d'un post via un modèle
    const newPost = new Post({
      title,
      author: session.userId,
      markdownArticle,
      markdownHTMLResult,
      tags: tagIds,
      coverImageUrl: publicImageUrl,
    });

    // Sauvegarde du document
    const savedPost = await newPost.save();
    return { success: true, slug: savedPost.slug };
  } catch(error) {
    console.error("Error while creating the post: ", error); // Uniquement côté serveur

    if(error instanceof AppError) {
      throw error;
    }
    
    throw new Error("An error occurred while creating the post"); // Message générique suite à une erreur autre que AppError (venant de MongoDB ou slugify par exemple)
  }
}

export async function deletePost(id) {
  try {
    await connectToDB();

    const user = await sessionInfo();
    if(!user) {
      throw new AppError("Authentication required");
    } 
    
    const post = await Post.findById(id);
    if(!post) {
      throw new AppError("Post not found");
    }

    await Post.findByIdAndDelete(id);

    if(post.coverImageUrl) {
      const fileName = post.coverImageUrl.split("/").pop(); // Récupération du nom de fichier pour supprimer l'image
      const deleteUrl = `${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_ZONE}/${fileName}`; // URL de suppression de l'image sur BunnyCDN

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: { "AccessKey": process.env.BUNNY_STORAGE_API_KEY }
      });

      if(!response.ok) {
        throw new AppError(`Error while deleting the image : ${response.statusText}`);
      }
    }

    revalidatePath(`/article/${post.slug}`); // Revalidation de la page de l'article supprimé pour éviter de la garder en cache et ne plus servir l'article qui n'existe plus + recharge l'html de la page en cours

  } catch(error) {
    console.error("Error while deleting a post: ", error); // Uniquement côté serveur

    if(error instanceof AppError) {
      throw error;
    }
    
    throw new Error("An error occurred while deleting a post"); // Message générique suite à une erreur autre que AppError (venant de MongoDB ou slugify par exemple)
  }
}

// await Promise.all(): permet de lancer toutes les promises parallèlement et ainsi gagner en performance plutôt que d'attendre qu'une promise soit terminée pour lancer la suivante
// les promises sont compliquées en JS, il est important de bien les comprendre et de les travailler

// Pour tester une attaque xss, commentez la ligne "markdownHTMLResult = DOMPurify.sanitize(markdownHTMLResult);", 
// créez un nouvel article avec comme contenu : <img src="x" onerror="alert('XSS')" style="display: none;" />
// Lorsque vous ouvrez cet article, du javascript est lancé en arrière plan (ici affichage d'une alerte)


// server actions : ils sont fait pour être utilisés par les composants clients côté client. Vont créer des routes d'API. Méthodes utilisables par l'utilisateur directement sur une page
//                  avec en général un formulaire, des boutons etc. Souvent il faut un retour direct du texte ou des informations pour dire si l'action a été un succès ou pas. 
//                  Les erreurs doivent être gérées au cas par cas (try/catch, throw new Error).