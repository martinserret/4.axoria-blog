/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/serverActions/session/sessionServerActions";
import { useAuth } from "@/app/AuthContext";

export default function page() {
  const { setIsAuthenticated }  = useAuth();
  const serverInfoRef = useRef(null);
  const submitButtonRef = useRef(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    serverInfoRef.current.classList.add("hidden");
    serverInfoRef.current.textContent = "";
    submitButtonRef.current.disabled = true; // éviter le spam click

    try {
      const result = await login(new FormData(e.target));

      if(result.success) {
        setIsAuthenticated({
          loading: false,
          isConnected: true,
          userId: result.userId
        });
        router.push("/");
      }
    } catch(error) {
      serverInfoRef.current.classList.remove("hidden");
      serverInfoRef.current.textContent = error.message;
      submitButtonRef.current.disabled = false;
    }
  }
  
  return (
    <form 
      className="max-w-md mx-auto mt-36"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="userName"
        className="f-label"
      >Your email or your pseudo</label>
      <input
        className="f-auth-input"
        type="text"
        id="userName"
        name="userName"
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
        name="password"
        placeholder="Password"
        required
      />

      <button
        ref={submitButtonRef}
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 mt-6 mb-10 rounded border-none cursor-pointer"
      >
        Submit
      </button>

      <p ref={serverInfoRef} className="hidden text-center mb-10"></p>

      <a 
        href="/signup"
        className="mb-5 underline text-blue-600 block text-center"
      >
        You don't have an account ? Sign up
      </a>

    </form>
  );
}