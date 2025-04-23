"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function NavbarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function handleLogout() {

  }

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
            <Link href="/dashboard" className="block p-4">Dashboard</Link>
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