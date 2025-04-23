import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // lien entre les sessions et les utilisateurs
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // index pour la suppression automatique des sessions expirées
  }
});

// Vérifie si le modèle a déjà été créé lors d'une requête précédente vers le serveur, si oui on l'utilise sinon on crée le modèle
// Meilleure performance et gestion
export const Session = mongoose.models?.Session || mongoose.model("Session", sessionSchema);