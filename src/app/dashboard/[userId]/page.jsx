import Link from "next/link";

export default async function page({ params }) {
  const { userId } = await params;
  
  const posts = [
    {
      "_id": "680b9ed3375f4c13e620881d",
      "title": "Test image display",
      "author": {
        "_id": "6808aa6486f546392cc20f77",
        "userName": "test",
        "normalizedUserName": "test"
      },
      "markdownArticle": "Display image in article section 76",
      "markdownHTMLResult": "<p>Display image in article section 76</p>\n",
      "coverImageUrl": "https://axoria-blog-pz.b-cdn.net/5f706bb6-05f1-4760-9917-133f32ab5cb8_20157646.webp",
      "tags": [
        "680b998b6052ad0debef7603"
      ],
      "createdAt": "2025-04-25T14:40:19.313Z",
      "updatedAt": "2025-04-25T14:40:19.313Z",
      "slug": "test-image-display",
      "__v": 0
    }
  ];

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="text-3xl mb-5">Dashboard - Your Articles</h1>
      
      <ul>
        {posts.length > 0 ? (
          posts.map(post => (
            <li key={post._id} className="flex items-center mb-2 bg-slate-50 py-2 pl-4">
              <Link href={`/article/${post.slug}`} className="mr-auto underline underline-offset-2">
                {post.title}
              </Link>
              <button>Delete</button>
              <Link href={`/dashboard/edit/${post.slug}`} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded mr-2">
                Edit
              </Link>
            </li>
          ))
        ): (
          <li>You haven't created any articles yet</li>
        )}
      </ul>
    </main>
  );
}