"use client";
import { deletePost } from "@/lib/serverActions/blog/postServerActions";

import { useState } from "react";
import ValidationModal from "@/components/modals/ValidationModal";

export default function DeletePostButton({ id }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    deletePost(id);
    setShowModal(false);
  };

  return (
    <div>
      <button 
        onClick={() => setShowModal(true)}
        className="bg-red-600 hover:bg-red-700 min-w-20 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Delete
      </button>

      <ValidationModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}