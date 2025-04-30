import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  // URL de vérification de l'authentification de l'utilisateur
  const authCheckUrl = new URL("/api/auth/validateSession", request.url);

  // Envoie une requête à l'API de vérification d'authentification. 
  // Les cookies de la requête entrante sont inclus dans les en-têtes pour permettre à l'API de vérifier la session de l'utilisateur.
  const authResponse = await fetch(authCheckUrl, {
    headers: {
      cookie: (await cookies()).toString()
    },
    cache: "force-cache", // permet de mettre en cache la réponse pour éviter de faire une requête à chaque fois
    next: { tags: ["auth-session"] } // tags pour invalider le cache si nécessaire.
  });

  // Extrait la propriété authorized de la réponse JSON. Cette propriété indique si l'utilisateur est autorisé ou non.
  const { authorized } = await authResponse.json();

  if(!authorized) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl.origin));
  }

  // Si l'utilisateur est autorisé, le middleware permet à la requête de continuer vers la route demandée.
  return NextResponse.next();
}

export const config = {
  // Indique que ce middleware doit être exécuté pour toutes les routes qui commencent par /dashboard/. 
  // Le :path* signifie qu'il s'applique à toutes les sous-routes de /dashboard.
  matcher: ["/dashboard/:path*"]
};

// gestion des pages publics et privées