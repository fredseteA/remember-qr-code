import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Remember QR Code - Memorial Online",
  description:
    "Crie uma homenagem eterna para quem partiu. Gere um memorial online e receba um QR Code para colar no túmulo ou local especial.",
  icons: {
    icon: "/fav-ico.png", // <-- aqui está seu favicon
  },
    openGraph: {
    title: "Remember QR Code - Memorial Online",
    description: 
      "Crie uma homenagem eterna para quem partiu. Gere um memorial online e receba um QR Code para colar no túmulo ou local especial.",
    images: [
      {
        url: 'https://remember-qr.vercel.app/logo.png', // logo que vai aparecer no link
        width: 800, // Largura da imagem em pixels
        height: 600, // Altura da imagem em pixels
        alt: 'Logo Remember QR Code', 
      },
    ],
  },
  // PARA TWITTER CARDS TAMBÉM 
  twitter: {
    card: 'summary',
    title: "Remember QR Code - Memorial Online",
    description: "Crie uma homenagem eterna para quem partiu. Gere um memorial online e receba um QR Code para colar no túmulo ou local especial.",
    images: ['https://remember-qr.vercel.app/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
