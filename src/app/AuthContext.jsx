"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { SAsessionInfo } from "@/lib/serverActions/session/sessionServerActions";

// Ce contexte permettra de partager l'état d'authentification entre différents composants de l'application.
const AuthContext = createContext();

// Le provider AuthProvider encapsule l'application pour fournir l'état d'authentification à tous les composants enfants.
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState({
    loading: true,
    isConnected: false,
    userId: null
  });

  // useEffect est utilisé pour récupérer l'état de la session utilisateur lors du chargement du composant.
  useEffect(() => {
    async function fetchSession() {
      const session = await SAsessionInfo();
      setIsAuthenticated({
        loading: false,
        isConnected: session.success,
        userId: session.userId
      });
    }

    // Appel de la fonction fetchSession pour récupérer l'état de la session utilisateur.
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      { children }
    </AuthContext.Provider>
  );
}

// Le hook useAuth permet d'accéder facilement à l'état d'authentification depuis n'importe quel composant enfant.
export function useAuth() {
  return useContext(AuthContext);
}

// Ce contexte d'authentification est utile pour gérer l'état de connexion de l'utilisateur .
//  Il permet de centraliser la logique d'authentification et de la rendre accessible à n'importe quel composant de l'application, facilitant ainsi la gestion des sessions utilisateur.