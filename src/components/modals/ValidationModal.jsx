"use client";

import { useEffect, useState } from "react";

export default function ValidationModal({ isOpen, onClose, onConfirm }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      // délai avant démontage pour jouer l'animation de fermeture
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showModal) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-slate-700/75 flex items-center justify-center z-50">
      <div 
        onClick={e => e.stopPropagation()}
        className={`
          bg-white rounded-lg p-6 w-full max-w-sm transform transition-all duration-300 ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
        `}
      >
        <h2 className="text-lg font-semibold mb-4">Confirm action</h2>
        <p className="mb-6">Do you really want to delete this article ?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}