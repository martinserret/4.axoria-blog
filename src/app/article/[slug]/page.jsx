import Link from "next/link";
import Image from "next/image";
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
        By&nbsp;
        <Link 
          href={`/categories/author/${post.author.normalizedUserName}`}
          className="mr-4 underline"
        >{
            post.author.userName}
        </Link>
        {post.tags.map(tag => (
          <Link
            href={`/categories/tag/${tag.slug}`}
            key={tag.slug}
            className="mr-4 underline"
          >
            #{tag.name}
          </Link>
        ))}
      </p>

      <Image 
        src={post.coverImageUrl} 
        width={1280}
        height={720}
        alt={post.title}
        className="mb-10"
      />

      <div
        className="article-styles"
        dangerouslySetInnerHTML={{ __html: post.markdownHTMLResult }}
      >
        
      </div>
    </main>
  );
}

// dangerouslySetInnerHTML: attribut spécial qui permet d'intégrer du HTML (comme innerHTML) en jsx