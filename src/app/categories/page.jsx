import Link from "next/link";
import { getTags } from "@/lib/serverMethods/blog/tagMethods";

export default async function page() {
  const tags = await getTags();
  
  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">All categories</h1>
      <p className="t-main-subtitle">Find articles sorted by category tag</p>

      <ul className="u-articles-grid">
        {tags.length > 0 ? (
          tags.map(tag => (
            <li key={tag._id} className="bg-gray-100 border border-gray-300 rounded shadow-md">
              <Link href={`/categories/tag/${tag.slug}`} className="flex items-baseline p-4 ">
                <span className=" text-lg font-semibold underline">#{tag.name}</span>
                <span className="ml-auto">{tag.postCount}</span>
              </Link>
            </li>
          ))
        ) : (
          <li>No categories found</li>
        )}
      </ul>
    </main>
  );
}