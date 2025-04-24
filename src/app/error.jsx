"use client";

import Link from "next/link";

export default function error() {
  return (
    <div className="pt-44 text-center">
      <h1 className="text-2xl mb-4">A server error has occurred</h1>
      <Link href="/" className="underline">Return home</Link>
    </div>
  );
}