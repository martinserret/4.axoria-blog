/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "axoria-blog-pz.b-cdn.net",
      pathname: "/**"
    }]
  }
};

export default nextConfig;

// Ici on configure le nom de domaine vers lequel Next.js va faire des requêtes pour les images : 
// le protocol est https, le nom de domaine est axoria-blog-pz.b-cdn.net qui provient du pull zone de Bunny CDN et le pathname est /** (toutes les images)