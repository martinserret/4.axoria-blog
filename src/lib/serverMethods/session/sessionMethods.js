import { cookies } from "next/headers";

import { connectToDB } from "@/lib/utils/db/connectToDB";

import { Session } from "@/lib/models/session";
import { User } from "@/lib/models/user";


export async function sessionInfo() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if(!sessionId) {
    return { success: false };
  }
  
  await connectToDB();
  const session = await Session.findById(sessionId);
  
  if(!session || session.expiresAt < new Date()) {
    return { success: false };
  }
  
  const user = await User.findById(session.userId);
  
  if(!user) {
    return { success: false };
  }

  return { success: true, userId: user._id.toString() };
}



// server methods : ils sont fait pour être utilisés par les composants backend côté backend. Ils sont utiles le plus souvent pour la création de pages et ne sont utilisés que côté serveur.
//                  A la différence des serverActions, on ne retourne pas un texte ou un élément pour indiqué que ça n'a pas fonctionné mais directement une page


// Ici les try/catch sont implicites sur les fonctions serveurs et sont gérés par nextjs