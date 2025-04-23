import Link from "next/link";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import { getPosts } from "@/lib/serverMethods/blog/postMethods";

export default async function Home() {
  const posts = await getPosts();
  
  return (
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Stay up to date with AXORIA</h1>
      <p className="t-main-subtitle">News and useful knowledge</p>

      <p className="text-md text-zinc-900">Latest articles</p>
      <ul className="u-articles-grid">
        {posts.map((post, id) => (
          <li
            className="rounded-sm shadow-md border border-transparent hover:shadow-xl hover:border-zinc-300"
            key={id}
          >
            <div className="pt-5 px-5 pb-7">
              <div className="flex items-baseline gap-x-4 text-xs">
                <time
                  dateTime={new Date().toISOString()}
                  className="text-gray-500 text-sm"
                > 
                  {new Date().toLocaleDateString("en-EN", { year: "numeric", month: "long", day: "numeric" })}
                </time>

                <Link 
                  href={"/categories/author/johndoe"}
                  className="ml-auto text-base text-gray-700 hover:text-gray-600 whitespace-nowrap truncate"
                >
                  John Doe
                </Link>
              </div>
              <Link 
                href={`/article/${post.slug}`}
                className="inline-block mt-6 text-xl font-semibold text-zinc-800 hover:text-zinc-600"
              >
                {post.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// <time dateTime={new Date().toISOString()}>  : meilleur élément pour le SEO et donc pour l'indexation des pages (meilleur lecture des crawlers)
// {new Date().toLocaleDateString("en-EN", { year: "numeric", month: "long", day: "numeric" })} : il suffit de remplacer par fr-FR pour l'avoir en français