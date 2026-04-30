import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vendly — Agente IA para WhatsApp e Instagram",
  description:
    "Vendly atiende a tus clientes en WhatsApp e Instagram las 24 horas. Agente IA que aprende de tu negocio y convierte conversaciones en ventas automáticamente.",
  keywords: ["agente IA", "WhatsApp Business", "Instagram ventas", "chatbot IA", "automatización ventas", "Meta API"],
  openGraph: {
    title: "Vendly — Tu vendedor IA que nunca para",
    description:
      "Automatizá la atención al cliente en WhatsApp e Instagram. El agente IA aprende de tu negocio y cierra ventas 24/7.",
    type: "website",
    locale: "es_AR",
    siteName: "Vendly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendly — Tu vendedor IA que nunca para",
    description:
      "Automatizá la atención al cliente en WhatsApp e Instagram. El agente IA aprende de tu negocio y cierra ventas 24/7.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
