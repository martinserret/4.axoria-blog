import Link from "next/link";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import { getPosts } from "@/lib/serverMethods/blog/postMethods";

import BlogCard from "@/components/BlogCard";

export default async function Home() {
  const posts = await getPosts();
  
  return (
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Stay up to date with AXORIA</h1>
      <p className="t-main-subtitle">News and useful knowledge</p>

      <p className="text-md text-zinc-900">Latest articles</p>
      <ul className="u-articles-grid">
        {posts.map((post, id) => (
          <BlogCard post={post} key={id} />
        ))}
      </ul>
    </div>
  );
}

// <time dateTime={new Date().toISOString()}>  : meilleur élément pour le SEO et donc pour l'indexation des pages (meilleur lecture des crawlers)
// {new Date().toLocaleDateString("en-EN", { year: "numeric", month: "long", day: "numeric" })} : il suffit de remplacer par fr-FR pour l'avoir en français