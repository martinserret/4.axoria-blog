"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

import bcrypt from "bcryptjs";
import slugify from "slugify";

import { connectToDB } from "@/lib/utils/db/connectToDB";
import { User } from "@/lib/models/user";
import { Session } from "@/lib/models/session";

import AppError from "@/lib/utils/errorHandling/customError";

export async function register(formData) {
  const { userName, email, password, passwordRepeat } = Object.fromEntries(formData);

  
  try {
    // Vérification côté serveur si jamais l'utilisateur a bypass la vérification côté client (via la console par exemple)
    if(typeof userName !== "string" || userName.trim().length < 3) {
      throw new AppError("Username must be at least 3 characters long");
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(typeof email !== "string" || !emailRegex.test(email.trim())){
      throw new AppError("E-mail format isn't correct");
    }
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.;,:/])[A-Za-z\d@$!%*?&]{6,}$/;
    if(typeof password !== "string" || !passwordRegex.test(password)) {
      throw new AppError("Password doesn't respect the rules (6 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character)");
    }
  
    if(password !== passwordRepeat) {
      throw new AppError("Passwords don't match");
    }

    await connectToDB();

    // Recherche de l'utilisateur dans la bdd à partir de son username ou de son email
    const user = await User.findOne({
      $or: [{ userName }, { email }]
    });

    if(user) {
      throw new AppError(user.userName === userName ? "Username already exists" : "Email already exists");
    }

    const normalizedUserName = slugify(userName, { lower: true, strict: true });

    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      normalizedUserName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("User saved to db");
    
    return { success: true };

  } catch(error) {
    console.error("Error while registering: ", error); // Uniquement côté serveur
    
    if(error instanceof AppError) {
      throw error;
    }
        
    throw new Error("An error occurred while registering"); // Message générique suite à une erreur autre que AppError (venant de MongoDB ou slugify par exemple)
  }
}

export async function login(formData) {
  const { userName, password } = Object.fromEntries(formData);
  
  try {
    await connectToDB();

    // Recherche de l'utilisateur dans la bdd à partir de son username ou de son email
    const user = await User.findOne({
      $or: [{ userName: userName }, { email: userName }]
    });

    if(!user) {
      throw new AppError("Invalid credentials"); // Ne pas mettre "invalid username" pour éviter de donner trop d'informations sur la base de données
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      throw new AppError("Invalid credentials"); // Ne pas mettre "invalid password" pour éviter de donner trop d'informations sur la base de données
    }

    let session;

    // Recherche d'une potentielle session existante dans ma collection de session via userId unique et vérification de la date d'expiration
    const existingSession = await Session.findOne({
      userId: user._id,
      expiresAt: { $gt: new Date() }
    });

    // Mise à jour ou création de la session côté serveur
    if(existingSession) {
      session = existingSession;
      existingSession.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // On étend la date d'expiration de 7 jours
      await existingSession.save();
    } else {
      session = new Session({
        userId: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      await session.save();
    }

    // Création d'un cookie de session (chaque requête du client enverra ce cookie)
    const cookieStore = await cookies();
    cookieStore.set("sessionId", session._id.toString(), {
      httpOnly: true, // Le cookie ne sera pas accessible via le JS côté client (protection)
      secure: process.env.NODE_ENV === "production", // En production (non en local), le cookie ne sera envoyé que sur des requêtes sécurisées HTTPS
      path: "/", // La racine indique que le cookie est accessible sur tout le site
      maxAge: 7 * 24 * 60 * 60, // Durée de vie du cookie en minutes(7 jours)
      sameSite: "lax", // Bloque l'envoie de cookies sur d'autres domaines que le domaine de notre site
    });

    revalidateTag("auth-session"); // On revalide le cache de la session pour que le middleware puisse rediriger l'utilisateur vers la page de connexion
    return { success: true, userId: user._id.toString() };
  } catch(error) {
    console.error("Error while log in: ", error); // Uniquement côté serveur
    
    if(error instanceof AppError) {
      throw error;
    }
        
    throw new Error("An error occurred while log in"); // Message générique suite à une erreur autre que AppError (venant de MongoDB ou slugify par exemple)
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  try {
    await Session.findByIdAndDelete(sessionId);

    cookieStore.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // On met la durée de vie à 0 pour supprimer le cookie
      sameSite: "strict" 
    });

    revalidateTag("auth-session"); // On revalide le cache de la session pour que le middleware puisse rediriger l'utilisateur vers la page de connexion
    return  { success: true };
  } catch (error) {
    console.error("Error while logging out", error);
  }
}

export async function isPrivatePage(pathname) {
  const privateSegments = ["/dashboard", "/settings/profile"]; // Les segments de chemin qui sont privés (ici tout ce qui commence par /dashboard et /settings/profile)

  // On vérifie si le pathname correspond à un des segments privés ou commence par un de ces segments
  return privateSegments.some(segment => pathname === segment || pathname.startsWith(`${segment}/`));
}

export async function SAsessionInfo() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if(!sessionId) {
    return { success: false };
  }
  
  await connectToDB();
  const session = await Session.findById(sessionId);
  
  if(!session || session.expiresAt < new Date()) {
    return { success: false, userId: null };
  }
  
  const user = await User.findById(session.userId);
  
  if(!user) {
    return { success: false, userId: null };
  }

  return { success: true, userId: user._id.toString() };
}

// server actions : ils sont fait pour être utilisés par les composants clients côté client. Vont créer des routes d'API. Méthodes utilisables par l'utilisateur directement sur une page
//                  avec en général un formulaire, des boutons etc. Souvent il faut un retour direct du texte ou des informations pour dire si l'action a été un succès ou pas. 
//                  Les erreurs doivent être gérées au cas par cas (try/catch, throw new Error).

// privateSegments.some() : retourne true ou false en fonction de la condition définie dans le retour de la callback