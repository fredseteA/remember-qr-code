import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Camera, Heart } from "lucide-react"
import { ChristianCross } from "@/components/ui/christian-cross"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-2">Remember QR Code</h1>
          <div className="w-24 h-1 bg-blue-300 mx-auto rounded-full"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <ChristianCross className="w-12 h-12 text-blue-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <QrCode className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-light text-slate-700 mb-6 leading-relaxed">
            Crie uma homenagem eterna para quem partiu
          </h2>

          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Gere um memorial online e receba um QR Code para colar no túmulo ou local especial. Uma forma moderna e
            carinhosa de preservar memórias e permitir que outros prestem suas homenagens.
          </p>

          <Link href="/criar-memorial">
            <Button
              size="lg"
              className="bg-blue-400 hover:bg-blue-500 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Criar Memorial
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-700 mb-3">Memorial Personalizado</h3>
              <p className="text-slate-600">Crie uma página única com fotos, biografia e mensagens especiais</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChristianCross className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-700 mb-3">QR Code Exclusivo</h3>
              <p className="text-slate-600">Receba um QR Code para colocar no túmulo ou local de memória</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-700 mb-3">Galeria de Fotos</h3>
              <p className="text-slate-600">Compartilhe até 10 fotos especiais e preserve as melhores lembranças</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 Remember QR Code - Preservando memórias com carinho</p>
        <div className="mt-2">
          <Link href="/setup" className="text-blue-400 hover:text-blue-500 text-xs">
            Configurar EmailJS
          </Link>
        </div>
      </footer>
    </div>
  )
}
