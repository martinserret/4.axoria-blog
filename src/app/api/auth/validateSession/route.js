import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { Session } from "@/lib/models/session";
import { User } from "@/lib/models/user";

import { connectToDB } from "@/lib/utils/db/connectToDB";

// Cette fonction est exécutée lorsqu'une requête GET est envoyée à cette route
export async function GET() {
  try {
    // Récupère l'identifiant de session (sessionId) à partir des cookies de la requête. Si le cookie sessionId n'existe pas, sessionId sera undefined.
    const sessionId = (await cookies()).get("sessionId")?.value;

    if(!sessionId) {
      return NextResponse.json({ authorized: false }, { status: 500 });
    }
    
    await connectToDB();
    
    // Recherche la session dans la base de données en utilisant sessionId.
    const session = await Session.findById(sessionId);
    if(!session || session.expiresAt < new Date()) {
      return NextResponse.json({ authorized: false }, { status: 500 });
    }

    // Si la session est valide, recherche l'utilisateur associé à cette session en utilisant session.userId.
    const user = await User.findById(session.userId);
    if(!user) {
      return NextResponse.json({ authorized: false }, { status: 500 });
    }

    // Si toutes les vérifications sont passées, retourne une réponse JSON indiquant que l'utilisateur est autorisé (authorized: true) et inclut l'identifiant de l'utilisateur (userId).
    return NextResponse.json({ authorized: true, userId: user._id.toString() });
  } catch(error) {
    console.error("Error while validating session", error);
    return NextResponse.json({ authorized: false }, { status: 500 });
  }
} 

// Cette route API est utilisée pour valider une session utilisateur en vérifiant l'existence et la validité d'un identifiant de session stocké dans un cookie. Si la session est valide et que l'utilisateur associé existe, la route retourne une réponse indiquant que l'utilisateur est autorisé. Sinon, elle retourne une réponse non autorisée. Cette validation est typiquement utilisée pour protéger les routes ou les ressources sensibles dans une application web.