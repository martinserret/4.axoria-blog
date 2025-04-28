import Link from "next/link";

import { sessionInfo } from "@/lib/serverMethods/session/sessionMethods";

import NavbarDropdown from "./NavbarDropdown";

export default async function Navbar() {
  const session = await sessionInfo();

  return (
    <nav className="fixed w-full bg-slate-50 border-b border-b-zinc-300">
      <div className="u-main-container flex py-4">
        <Link href="/" className="mr-2 text-zinc-900">AXORIA</Link>
        <Link href="/categories" className="mx-2 text-zinc-900 mr-auto">Categories</Link>

        {session.success ? (
          <>
            <Link href="/dashboard/create" className="mx-4 text-zinc-900">Add an article</Link>
            <NavbarDropdown userId={session.userId} />
          </>
        ) : (
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