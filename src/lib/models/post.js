import mongoose from "mongoose";
import slugify from "slugify";

// Structure de nos données
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  markdownArticle: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Middleware qui va être exécuté lors de la sauvegarde d'un document
// attention à ne pas mettre une fonction fléchée à la place de async (next) => {}
postSchema.pre("save", async function(next) {
  if(!this.slug) {
    // Création un slug pour le post
  
    let slugCandidate = slugify(this.title, { lower: true, strict: true });

    let slugExists = await mongoose.models.Post.findOne({ slug: slugCandidate });
    
    let counter = 1; 
    while(slugExists) {
      // Vérifie que le slug n'existe pas, si c'est le cas, ajoute un chiffre à la fin pour le différencier. 
      // Ce chiffre s'incrémente si il existe déjà un slug avec un chiffre à la fin 
      slugCandidate = `${slugCandidate}-${counter}`;
      slugExists = await mongoose.models.Post.findOne({ slug: slugCandidate });
      counter++;
    }

    this.slug = slugCandidate;
  }

  next();
});

// On récupère ou on crée notre modèle. Il y a un cache avec mongoose qui permet de mettre en cache un modèle s'il a déjà été créé et de le réutiliser
export const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);


////////////////////////////////////////////////////////////////////////////////
// Attention à ne pas mettre une fonction fléchée à la place de async (next) => {}
////////////////////////////////////////////////////////////////////////////////
// Les fonctions fléchées n'ont pas leur propre contexte this. Elles capturent le contexte this du contexte environnant au moment de leur création. Cela signifie que si vous utilisez une fonction fléchée dans un middleware Mongoose, this ne fera pas référence à l'instance du document en cours de traitement.

// Dans une fonction classique, this est lié dynamiquement, ce qui signifie qu'il fait référence à l'objet qui appelle la fonction. Dans le cas d'un middleware Mongoose, this fait référence au document qui est en cours de sauvegarde.