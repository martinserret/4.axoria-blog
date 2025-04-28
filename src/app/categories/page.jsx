import { getTags } from "@/lib/serverMethods/blog/tagMethods";

export default async function page() {
  const tags = await getTags();
  console.log(tags, "tagsConsole");
  
  
  return (
    <div>page</div>
  );
}