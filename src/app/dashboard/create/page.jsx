/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useRef } from "react";
import { addPost } from "@/lib/serverActions/blog/postServerActions";

export default function page() {
  const [tags, setTags] = useState([]);
  const tagInputRef = useRef(null);

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
    formData.set("tags", JSON.stringify(tags));

    const result = await addPost(formData);
    console.log(result);
  }

  return (
    <main className="u-main-container bg-white p-7 mt-32 mb-44">
      <h1 className="text-4xl mb-4">Write an article ✍️</h1>

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
        />

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
        ></textarea>

        <button
          className="min-w-44 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded mb-4 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </main>
  );
}

// FormData() : objet JS permettant de stocker les valeurs des inputs d'un formulaire, notamment les données complexes comme
// les images, les vidéos, les zip, etc., de manière optimisée. Un objet est automatiquement créé à partir de ces inputs. 


// <button type="button"></button> : il est important de spécifier type="button" lorsque'on ajoute un bouton dans le formulaire dont l'objectif n'est pas de retourner (submit) le formulaire
// mais qui réalise une autre action dans le formulaire (comme ici ajouter un tag). type peut aussi prendre la valeur "submit" si on souhaite qu'il submit le formulaire (comportement par défaut de type donc pas la peine
// de le préciser si l'objectif du bouton est de submit le formulaire)