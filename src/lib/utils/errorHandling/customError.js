export default class AppError extends Error {
  constructor(message = "An error has occurred") {
    super(message);
    this.name = "AppError";
  }
}

// Nous souhaitons absolument éviter d'envoyer côté client des messages d'erreur trop détaillés qui permettraient de créer des failles de sécurité et donner des informations au client.
// Par exemple les dépendances ou les modèles utilisées, etc.
// (et également envoyer des erreurs en anglais alors que l'application est dans une autre langue)

// Le try/catch est implicite dans Next.js mais il est plus sécurisé de l'utiliser explicitement pour gérer les erreurs.

// Créer un sous-classe héritée d'Error permet de distinguer si l'erreur vient de la classe Error ou de la classe héritée (AppError ici). 
// Cette sous classe va fonctionner de la même manière que Error.