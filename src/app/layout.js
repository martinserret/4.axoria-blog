import "./globals.css";
import { Roboto, Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "./AuthContext";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Axoria Blog",
  description: "A tech blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <body className={`flex min-h-full flex-col ${roboto.variable} ${inter.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
        
          <main className="grow">
            {children}
          </main>
        </AuthProvider>

        <Footer />
      </body>
    </html>
  );
}
