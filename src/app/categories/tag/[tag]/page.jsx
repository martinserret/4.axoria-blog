import { getPostsByTag } from "@/lib/serverMethods/blog/postMethods";
import BlogCard from "@/components/BlogCard";


export default async function page({ params }) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  console.log(posts);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Posts from the #{tag} tag 🏷️</h1>
      <p className="t-main-subtitle">All the post that use this tag</p>
      <p className="mr-4 text-md text-zinc-900">Latest articles</p>
      <ul className="u-articles-grid">
        {posts.length > 0 ? (
          posts.map(post => (
            <BlogCard key={post._id} post={post}></BlogCard>
          ))
        ) : (
          <li>No articles found for that tag 🤖</li>
        )}
      </ul>
    </main>
  );
}