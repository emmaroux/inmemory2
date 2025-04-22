import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "./components/layout/Navbar";

export const metadata: Metadata = {
  title: "InMemory - Ressources de développement",
  description: "Partagez et découvrez des ressources de développement avec votre équipe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="light" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-white">
        <Navbar />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
