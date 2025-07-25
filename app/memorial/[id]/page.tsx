"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Calendar, QrCode, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { ChristianCross } from "@/components/ui/christian-cross"
import Link from "next/link"
import emailjs from "@emailjs/browser"

interface MemorialData {
  nomeCompleto: string
  localSepultamento: string
  dataNascimento: string
  dataFalecimento: string
  biografia: string
  fotos: string[]
}

interface SolicitanteData {
  nome: string
  email: string
  telefone: string
}

export default function MemorialPage() {
  const params = useParams()
  const [memorial, setMemorial] = useState<MemorialData | null>(null)
  const [solicitante, setSolicitante] = useState<SolicitanteData>({
    nome: "",
    email: "",
    telefone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const memorialId = params.id as string
    const savedMemorial = localStorage.getItem(`memorial_${memorialId}`)

    if (savedMemorial) {
      setMemorial(JSON.parse(savedMemorial))
    }

    // Debug das variáveis de ambiente
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

    const debug = `
Debug Info:
- Public Key: ${publicKey ? `${publicKey.substring(0, 10)}...` : "NÃO ENCONTRADA"}
- Service ID: ${serviceId || "NÃO ENCONTRADO"}
- Template ID: ${templateId || "NÃO ENCONTRADO"}
- Todas configuradas: ${publicKey && serviceId && templateId ? "SIM" : "NÃO"}
    `
    setDebugInfo(debug)
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const calculateAge = (nascimento: string, falecimento: string) => {
    const nascDate = new Date(nascimento)
    const falecDate = new Date(falecimento)
    const age = falecDate.getFullYear() - nascDate.getFullYear()
    return age
  }

  const handleSolicitarQR = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Verificar se as chaves do EmailJS estão configuradas
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

      console.log("🔍 Debug EmailJS:", {
        publicKey: publicKey ? `${publicKey.substring(0, 10)}...` : "NÃO ENCONTRADA",
        serviceId: serviceId || "NÃO ENCONTRADO",
        templateId: templateId || "NÃO ENCONTRADO",
      })

      if (!publicKey || !serviceId || !templateId) {
        console.log("⚠️ Chaves não configuradas, usando fallback...")

        // Fallback: mostrar dados para contato manual
        const emailBody = `Solicitação de QR Code - Remember QR Code

DADOS DO SOLICITANTE:
Nome: ${solicitante.nome}
Email: ${solicitante.email}
Telefone: ${solicitante.telefone}

DADOS DO MEMORIAL:
Nome do Falecido: ${memorial?.nomeCompleto}
Local de Sepultamento: ${memorial?.localSepultamento}
Data de Nascimento: ${formatDate(memorial?.dataNascimento || "")}
Data de Falecimento: ${formatDate(memorial?.dataFalecimento || "")}
URL do Memorial: ${window.location.href}

Por favor, entre em contato para solicitar o QR Code.`

        // Abrir cliente de email padrão
        const mailtoLink = `mailto:fredericoluna93@gmail.com?subject=Solicitação de QR Code - ${memorial?.nomeCompleto}&body=${encodeURIComponent(emailBody)}`
        window.open(mailtoLink, "_blank")

        alert(
          "✅ Seu cliente de email foi aberto com os dados preenchidos!\n\nSe não abriu automaticamente, copie os dados e envie para fredericoluna93@gmail.com",
        )
        setDialogOpen(false)
        setSolicitante({ nome: "", email: "", telefone: "" })
        return
      }

      // Se as chaves estão configuradas, usar EmailJS
      console.log("📧 Tentando enviar via EmailJS...")

      // Inicializar EmailJS
      emailjs.init(publicKey)

      const templateParams = {
        solicitante_nome: solicitante.nome,
        solicitante_email: solicitante.email,
        solicitante_telefone: solicitante.telefone,
        memorial_nome: memorial?.nomeCompleto,
        memorial_local: memorial?.localSepultamento,
        memorial_nascimento: formatDate(memorial?.dataNascimento || ""),
        memorial_falecimento: formatDate(memorial?.dataFalecimento || ""),
        memorial_url: window.location.href,
        to_email: "fredericoluna93@gmail.com",
      }

      console.log("📋 Parâmetros do template:", templateParams)

      const result = await emailjs.send(serviceId, templateId, templateParams)

      console.log("✅ Email enviado com sucesso:", result)

      alert("✅ Solicitação enviada com sucesso! Entraremos em contato em breve.")
      setDialogOpen(false)
      setSolicitante({ nome: "", email: "", telefone: "" })
    } catch (error: any) {
      console.error("❌ Erro detalhado:", error)

      // Mostrar erro mais detalhado
      let errorMessage = "Erro desconhecido"
      if (error.text) {
        errorMessage = error.text
      } else if (error.message) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      console.log("🔄 Usando fallback devido ao erro:", errorMessage)

      // Fallback em caso de erro
      const emailBody = `Solicitação de QR Code - Remember QR Code

DADOS DO SOLICITANTE:
Nome: ${solicitante.nome}
Email: ${solicitante.email}
Telefone: ${solicitante.telefone}

DADOS DO MEMORIAL:
Nome do Falecido: ${memorial?.nomeCompleto}
Local de Sepultamento: ${memorial?.localSepultamento}
Data de Nascimento: ${formatDate(memorial?.dataNascimento || "")}
Data de Falecimento: ${formatDate(memorial?.dataFalecimento || "")}
URL do Memorial: ${window.location.href}

ERRO TÉCNICO: ${errorMessage}`

      const mailtoLink = `mailto:fredericoluna93@gmail.com?subject=Solicitação de QR Code - ${memorial?.nomeCompleto}&body=${encodeURIComponent(emailBody)}`
      window.open(mailtoLink, "_blank")

      alert(
        `⚠️ Problema no envio automático: ${errorMessage}\n\n✅ Seu cliente de email foi aberto com os dados preenchidos como alternativa.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Memorial não encontrado</p>
          <Link href="/">
            <Button variant="outline">Voltar ao início</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>

          {/* Debug Info - apenas em desenvolvimento */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4">
              <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)} className="text-xs">
                {showDebug ? "Ocultar" : "Mostrar"} Debug
              </Button>
              {showDebug && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        {/* Memorial Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChristianCross className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">{memorial.nomeCompleto}</h1>
          <p className="text-xl text-slate-600">
            {formatDate(memorial.dataNascimento)} - {formatDate(memorial.dataFalecimento)}
          </p>
          <p className="text-lg text-slate-500 mt-2">
            {calculateAge(memorial.dataNascimento, memorial.dataFalecimento)} anos
          </p>
        </div>

        {/* Memorial Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-medium text-slate-700">Local de Descanso</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">{memorial.localSepultamento}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-medium text-slate-700">Datas Importantes</h3>
              </div>
              <div className="space-y-2 text-slate-600">
                <p>
                  <strong>Nascimento:</strong> {formatDate(memorial.dataNascimento)}
                </p>
                <p>
                  <strong>Falecimento:</strong> {formatDate(memorial.dataFalecimento)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Biografia */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-12">
          <CardContent className="p-8">
            <h3 className="text-2xl font-light text-slate-700 mb-6">Biografia</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{memorial.biografia}</p>
          </CardContent>
        </Card>

        {/* Galeria de Fotos */}
        {memorial.fotos.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-light text-slate-700 mb-6">Galeria de Memórias</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {memorial.fotos.map((foto, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={foto || "/placeholder.svg"}
                      alt={`Memória ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão Solicitar QR Code */}
        <div className="text-center">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-blue-400 hover:bg-blue-500 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <QrCode className="w-6 h-6 mr-3" />
                Solicitar QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-light text-slate-700">Solicitar QR Code</DialogTitle>
              </DialogHeader>

              {/* Status das configurações */}
              <Alert className="mb-4">
                {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700">
                      EmailJS configurado - envio automático ativado
                    </AlertDescription>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-700">
                      EmailJS não configurado - será usado cliente de email padrão
                    </AlertDescription>
                  </>
                )}
              </Alert>

              <form onSubmit={handleSolicitarQR} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Seu Nome *</Label>
                  <Input
                    id="nome"
                    value={solicitante.nome}
                    onChange={(e) => setSolicitante((prev) => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={solicitante.email}
                    onChange={(e) => setSolicitante((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone (WhatsApp) *</Label>
                  <Input
                    id="telefone"
                    value={solicitante.telefone}
                    onChange={(e) => setSolicitante((prev) => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-400 hover:bg-blue-500" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
