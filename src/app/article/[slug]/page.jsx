import Link from "next/link";
import { getPost } from "@/lib/serverMethods/blog/postMethods";
import "./article-style.css";
import "prism-themes/themes/prism-darcula.css"; // Theme permettant la coloration syntaxique du code

export default async function page({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="text-4xl mb-3">{post.title}</h1>
      <p className="mb-6">
        {post.tags.map(tag => (
          <Link
            href={`categories/tag/${tag.slug}`}
            key={tag.slug}
            className="mr-4 underline"
          >
            #{tag.name}
          </Link>
        ))}
      </p>
      <div
        className="article-styles"
        dangerouslySetInnerHTML={{ __html: post.markdownHTMLResult }}
      >
        
      </div>
    </main>
  );
}

// dangerouslySetInnerHTML: attribut spécial qui permet d'intégrer du HTML (comme innerHTML) en jsx