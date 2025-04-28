import { getPostsByTag } from "@/lib/serverMethods/blog/postMethods";


export default async function page({ params }) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  console.log(posts, "postsByTag");
  
  return (
    <div>page</div>
  );
}