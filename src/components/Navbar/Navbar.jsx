"use client";

import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/app/AuthContext";

import NavbarDropdown from "./NavbarDropdown";

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed w-full bg-slate-50 border-b border-b-zinc-300">
      <div className="u-main-container flex py-4">
        <Link href="/" className="mr-2 text-zinc-900">AXORIA</Link>
        <Link href="/categories" className="mx-2 text-zinc-900 mr-auto">Categories</Link>

        {/* Si la vérification d'authentification est en cours : affichage du loader */}
        { isAuthenticated.loading && (
          <div>
            <Image src="/icons/loader.svg" width={24} height={24} alt=""></Image>
          </div>
        )}

        {/* La vérification d'authentification est un succès : affichage de "Add an article" et du menu dropdown */}
        { isAuthenticated.isConnected && (
          <>
            <Link href="/dashboard/create" className="mx-4 text-zinc-900">Add an article</Link>
            <NavbarDropdown userId={isAuthenticated.userId} />
          </>
        )}

        {/* La vérification d'authentification est un échec et que le chargement est terminé : affichage de "sign in" et "sign up" */}
        { !isAuthenticated.isConnected && !isAuthenticated.loading && (
          <>
            <Link href="/signin" className="mx-2 text-zinc-900">Sign In</Link>
            <Link href="/signup" className="mx-2 text-zinc-900">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Ici tout se déroule côté serveur