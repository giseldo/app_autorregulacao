import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeoAVA-ARA | Autorregulação da Aprendizagem",
  description: "Sistema de Autorregulação da Aprendizagem (MSLQ) integrado ao Google Classroom",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
