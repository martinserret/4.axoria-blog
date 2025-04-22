/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useRef } from "react";

export default function page() {
  const serverInfoRef = useRef(null);
  const submitButtonRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
  }
  
  return (
    <form 
      className="max-w-md mx-auto mt-36"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="userName"
        className="f-label"
      >Your pseudo</label>
      <input
        className="f-auth-input"
        type="text"
        id="userName"
        placeholder="Pseudo"
        required
      />

      <label
        htmlFor="password"
        className="f-label"
      >Your password</label>
      <input
        className="f-auth-input"
        type="password"
        id="password"
        placeholder="Password"
        required
      />

      <button
        ref={submitButtonRef}
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 mt-6 mb-10 rounded border-none"
      >
        Submit
      </button>

      <p ref={serverInfoRef} className="text-center mb-10"></p>

      <a 
        href="/signup"
        className="mb-5 underline text-blue-600 block text-center"
      >
        You don't have an account ? Sign up
      </a>

    </form>
  );
}