import type { Metadata, Viewport } from "next";
import "./tailwind.css";

export const metadata: Metadata = {
  title: "BlackTube - Premium Narrative Engine",
  description: "Plataforma de mineração e criação de narrativas com IA",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ backgroundColor: "#020204", color: "#E8ECF4" }}>
        {children}
      </body>
    </html>
  );
}
