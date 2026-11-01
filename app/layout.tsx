import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAP KING — Grimpe jusqu'au sommet",
  description: "Tape, esquive les pièges, récupère des bonus et grimpe plus haut que tes amis."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}