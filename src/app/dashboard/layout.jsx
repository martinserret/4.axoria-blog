import { redirect } from "next/navigation";
import { sessionInfo } from "@/lib/serverMethods/session/sessionMethods";

export default async function layout({ children }) {
  const session = await sessionInfo();
  if(!session.success) {
    redirect("/signin");
  }
  
  return (
    <>{children}</>
  );
}