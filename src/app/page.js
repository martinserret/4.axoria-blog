import { getPosts } from "@/lib/serverMethods/blog/postMethods";
import BlogCard from "@/components/BlogCard";

export const revalidate = 60; // Revalidation toutes les 60 secondes

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

// Toutes les 60 secondes, la page va être marquée comme sale et la prochaine requête recréera cette page avec les nouvelles données et la mettra en cache pendant 60 secondes.
// Pendant 60 secondes c'est donc la page qui est en cache qui est servie aux utilisateurs. La page est la même pour tous les utilisateurs puis elle est régénérée au bout de 60 secondes dès qu'un utilisateur fait une nouvelle requête.