"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { editPost } from "@/lib/serverActions/blog/postServerActions";
import { areTagsSimilar } from "@/lib/utils/general/utils";

export default function ClientEditForm({ post }) {
  const [tags, setTags] = useState(post.tags.map(tag => tag.name)); // On initialise useState avec les tags du post
  const tagInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const serverValidationText = useRef(null);
  const router = useRouter();

  const imgUploadValidationText = useRef(null);

  function handleAddTag() {
    const newTag = tagInputRef.current.value.trim().toLowerCase();

    if(newTag !== "" && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag]);
      tagInputRef.current.value = "";
    }
  }

  function handleRemoveTag(tagToRemove) {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }

  function handleEnterOnTagInput(e) {
    if(e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  async function handleSubmit(e){
    e.preventDefault();

    const formData = new FormData(e.target);
    const readableFormData = Object.fromEntries(formData); // Permet de lire toute les valeurs des inputs
    const areSameTags = areTagsSimilar(tags, post.tags); // Compara les tags du post avec ceux de la DB

    if(readableFormData.coverImage.size === 0 && readableFormData.title.trim() === post.title && readableFormData.markdownArticle.trim() === post.markdownArticle && areSameTags) {
      serverValidationText.current.textContent = "You must make a change before submitting";
      return;
    } else {
      serverValidationText.current.textContent = ""; // Réinitialise le texte de serveur validation
    }

    formData.set("tags", JSON.stringify(tags));
    formData.set("postToEditStringified", JSON.stringify(post));

    serverValidationText.current.textContent = ""; // Réinitialise le texte de serveur validation
    submitButtonRef.current.textContent = "Updating Post..."; // Indique dans le bouton que la sauvegarde est en cours
    submitButtonRef.current.disabled = true; // Evite le spam click

    try {
      const result = await editPost(formData);

      if(result.success) {
        submitButtonRef.current.textContent = "Post Updated ✅";

        let countdown = 3;
        serverValidationText.current.textContent = `Redirecting in ${countdown}...`;
        const interval = setInterval(() => {
          countdown -= 1;
          serverValidationText.current.textContent = `Redirecting in ${countdown}...`;

          if(countdown === 0) {
            clearInterval(interval);
            router.push(`/article/${result.slug}`);
          }
        }, 1000);
      }
    } catch(error) {
      serverValidationText.current.textContent = `${error.message}`; // Affichage de l'erreur
      submitButtonRef.current.textContent = "Submit"; // Réinitialise le texte du bouton
      submitButtonRef.current.disabled = false; // Evite le spam click
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if(!validImageTypes.includes(file.type)) {
      imgUploadValidationText.current.textContent = "Please upload a valid image (jpeg, jpg, png, webp)"; // Si l'image n'est pas valide, on affiche un message d'erreur
      e.target.value = "";
    } else {
      imgUploadValidationText.current.textContent = ""; // Réinitialise le texte de validation
    }

    // On charge l'image pour vérifier ses dimensions
    const img = new Image();
    img.addEventListener("load", checkImgSizeOnLoad);

    function checkImgSizeOnLoad() {
      if(img.width > 1280 || img.height > 720) {
        imgUploadValidationText.current.textContent = "Image exceeds 1280x720 dimensions"; // Si l'image n'a pas une dimension valide, on affiche un message d'erreur
        e.target.value = "";
        URL.revokeObjectURL(img.src); // Libère la mémoire
        return;
      } else {
        imgUploadValidationText.current.textContent = ""; // Réinitialise le texte de validation
        URL.revokeObjectURL(img.src); // Libère la mémoire
      }
    }

    img.src = URL.createObjectURL(file); // Charge un objet une image et ses caractéristiques
  }

  return (
    <main className="u-main-container bg-white p-7 mt-32 mb-44">
      <h1 className="text-4xl mb-4">Edit your article ✍️</h1>

      <form 
        onSubmit={handleSubmit}
        className="pb-6"
      >
        {/* Title */}
        <label htmlFor="title" className="f-label">Title</label>
        <input
          type="text"
          name="title"
          className="shadow border border-gray-300 rounded w-full p-3 mb-7 text-gray-700 focus:outline-gray-400"
          id="title"
          placeholder="Title"
          required
          defaultValue={post.title} // On initialise le champ avec le titre du post
        />

        {/* Image */}
        <label htmlFor="coverImage" className="f-label">
          <span>Cover image (1280x720 for best quality, or less)</span>
          <span className="block font-normal text-sm">Changing image is <span className="font-bold">optional</span> in edit mode.</span>
        </label>
        <input 
          type="file" 
          name="coverImage"
          className="file:mr-5 file:p-3 file:rounded file:border-0 file:font-medium file:bg-indigo-500 file:text-white file:cursor-pointer w-full text-gray-700 hover:file:bg-indigo-700 mb-2"
          id="coverImage"
          placeholder="Article's cover image"
          onChange={handleFileChange}
        />
        <p className="font-normal text-sm">Actual image : <a href={post.coverImageUrl} target="_blank" className="underline text-indigo-700 hover:text-indigo-500">{post.coverImageUrl}</a></p>
        <p ref={imgUploadValidationText} className="text-red-700 mb-7"></p>

        {/* Tags */}
        <div className="mb-10">
          <label className="f-label" htmlFor="tag">Add a tag(s) (optional, max: 5)</label>
          <div className="flex">
            <input 
              type="text" 
              className="shadow border border-gray-300 rounded p-3 text-gray-700 focus:outline-slate-400"
              id="tag"
              placeholder="Add a tag"
              ref={tagInputRef}
              onKeyDown={handleEnterOnTagInput}
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-4 rounded mx-4 cursor-pointer"
              onClick={handleAddTag}
              type="button"
            >
              Add
            </button>
            <div className="flex items-center grow whitespace-nowrap overflow-y-auto shadow border-rounded px-3">
              {tags.map(tag => (
                <span 
                  key={tag}
                  className="inline-block whitespace-nowrap bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 ml-2 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Markdown article */}
        <label htmlFor="markdownArticle" className="f-label">Write your article using markdown (do not repeat the title)</label>
        <a 
          href="https://www.markdownguide.org/cheat-sheet/" 
          target="_blank"
          className="block mb-4 text-blue-600"
        > How to use markdown syntax ?</a>
        <textarea 
          name="markdownArticle" 
          id="markdownArticle"
          required
          className="min-h-44 border-gray-300 shadow appearance-none border rounded w-full p-8 text-gray-700 mb-4 focus:outline-slate-400"
          placeholder="Write the content of your article"
          defaultValue={post.markdownArticle} // On initialise le champ avec le contenu du post
        ></textarea>

        {/* Submit button */}
        <button
          ref={submitButtonRef}
          className="min-w-44 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded mb-4 cursor-pointer"
        >
          Submit
        </button>
        <p
          ref={serverValidationText}
        ></p>
      </form>
    </main>
  );
}

// FormData() : objet JS permettant de stocker les valeurs des inputs d'un formulaire, notamment les données complexes comme
// les images, les vidéos, les zip, etc., de manière optimisée. Un objet est automatiquement créé à partir de ces inputs. 


// <button type="button"></button> : il est important de spécifier type="button" lorsque'on ajoute un bouton dans le formulaire dont l'objectif n'est pas de retourner (submit) le formulaire
// mais qui réalise une autre action dans le formulaire (comme ici ajouter un tag). type peut aussi prendre la valeur "submit" si on souhaite qu'il submit le formulaire (comportement par défaut de type donc pas la peine
// de le préciser si l'objectif du bouton est de submit le formulaire)


// Il est possible (et conseillé) de faire des vérifications côté client plus poussées en utilisant des useRef pour vérifier les valeurs des inputs au cas par cas avant de les envoyer au serveur. 
// Par exemple pour vérifier la taille du titre, la taille de l'image, le nombre de tags, etc.