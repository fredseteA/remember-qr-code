import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* SEO e Open Graph */}
        <title>Remember QR Code - Memorial Online</title>
        <meta name="description" content="Crie uma homenagem eterna para quem partiu. Gere um memorial online e receba um QR Code para colar no túmulo ou local especial." />
        
        {/* Open Graph para Facebook, WhatsApp etc */}
        <meta property="og:title" content="Remember QR Code - Memorial Online" />
        <meta property="og:description" content="Crie uma homenagem eterna para quem partiu. Gere um memorial online e receba um QR Code para colar no túmulo ou local especial." />
        <meta property="og:image" content="https://remember-qr.vercel.app/logo-preview.png" />
        <meta property="og:url" content="https://remember-qr.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Remember QR Code - Memorial Online" />
        <meta name="twitter:description" content="Crie uma homenagem eterna para quem partiu. Gere um memorial online e receba um QR Code para colar no túmulo ou local especial." />
        <meta name="twitter:image" content="https://remember-qr.vercel.app/logo-preview.png" />

        {/* Ícone do site */}
        <link rel="icon" href="/fav-ico.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
