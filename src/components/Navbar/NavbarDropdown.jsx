"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { logout, isPrivatePage } from "@/lib/serverActions/session/sessionServerActions";
import { useAuth } from "@/app/AuthContext";

export default function NavbarDropdown({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  async function handleLogout() {
    const result = await logout();

    if(result.success) {
      setIsAuthenticated({
        loading: false,
        isConnected: false,
        userId: null
      });

      // Redirection si l'utilisateur se trouve sur une page privée
      if(isPrivatePage(window.location.pathname)){
        router.push("/signin");
      }
    }
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if(!dropdownRef.current.contains(event.target)){
        closeDropdown();
      }
    }

    document.addEventListener("click", handleClickOutside);

    // clean up fonction qui va se déclencher quand le composant se démonte et qui supprime l'event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex cursor-pointer"
        onClick={toggleDropdown}
      >
        <Image 
          src="/icons/user.svg"
          alt="Icon dropdown"
          width={24}
          height={24}
        />
      </button>

      { isOpen && (
        <ul className="absolute right-0 top-10 w-[250px] border-b border-x border-zinc-300">
          <li className="bg-slate-50 border-b border-slate-300 hover:bg-slate-200">
            <Link href={`/dashboard/${userId}`} className="block p-4" onClick={closeDropdown}>Dashboard</Link>
          </li>
          <li className="bg-slate-50 hover:bg-slate-200">
            <button 
              onClick={handleLogout} 
              className="w-full p-4 text-left cursor-pointer"
            >
              Sign out</button>
          </li>
        </ul>
      )}
    </div>
  );
}