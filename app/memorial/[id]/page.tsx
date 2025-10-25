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
import {
  MapPin,
  Calendar,
  QrCode,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Heart,
  User,
  Church,
  MessageCircle,
  Star,
  Smile,
  FileText,
} from "lucide-react"
import { ChristianCross } from "@/components/ui/christian-cross"
import Link from "next/link"
import type { MemorialData } from "@/lib/firestore"

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
  const [isUploadingFirebase, setIsUploadingFirebase] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const [isClient, setIsClient] = useState(false)
  const [firebaseError, setFirebaseError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Testar Firebase de forma segura
    const testFirebase = async () => {
      try {
        const { initializeFirebase } = await import("@/lib/firebase")
        await initializeFirebase()
        console.log("✅ Firebase disponível")
      } catch (error) {
        console.warn("⚠️ Firebase não disponível:", error)
        setFirebaseError("Firebase não disponível - usando fallback")
      }
    }

    testFirebase()
  }, [])

  useEffect(() => {
    const memorialId = params.id as string
    console.log("🔍 Buscando memorial com ID:", memorialId)

    // Função melhorada para carregar memorial com fallback
    const loadMemorial = () => {
      try {
        // Tentar localStorage primeiro
        let savedMemorial = null

        if (typeof Storage !== "undefined") {
          savedMemorial = localStorage.getItem(`memorial_${memorialId}`)

          // Se não encontrar no localStorage, tentar sessionStorage
          if (!savedMemorial) {
            console.log("🔄 Tentando sessionStorage...")
            savedMemorial = sessionStorage.getItem(`memorial_${memorialId}`)
          }
        }

        if (savedMemorial) {
          const memorialData = JSON.parse(savedMemorial)
          setMemorial(memorialData)
          console.log("✅ Memorial carregado:", memorialData.validado ? "✅ VALIDADO" : "⚠️ NÃO VALIDADO")
        } else {
          console.warn("⚠️ Memorial não encontrado no storage")
        }
      } catch (error) {
        console.error("❌ Erro ao carregar memorial:", error)
      }
    }

    loadMemorial()

    // Debug das variáveis de ambiente
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

    const debug = `
Debug Info:
- Public Key: ${publicKey ? `${publicKey.substring(0, 10)}...` : "NÃO ENCONTRADA"}
- Service ID: ${serviceId || "NÃO ENCONTRADO"}
- Template ID: ${templateId || "NÃO ENCONTRADO"}
- Firebase Project: remember-qr-code
- Todas configuradas: ${publicKey && serviceId && templateId ? "SIM" : "NÃO"}
- Storage disponível: ${typeof Storage !== "undefined" ? "SIM" : "NÃO"}
- User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent.substring(0, 50) + "..." : "N/A"}
    `
    setDebugInfo(debug)
  }, [params.id])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch (error) {
      console.warn("⚠️ Erro ao formatar data:", dateString)
      return dateString
    }
  }

  const calculateAge = (nascimento: string, falecimento: string) => {
    try {
      const nascDate = new Date(nascimento)
      const falecDate = new Date(falecimento)
      const age = falecDate.getFullYear() - nascDate.getFullYear()
      return age
    } catch (error) {
      console.warn("⚠️ Erro ao calcular idade")
      return 0
    }
  }

  const handleSolicitarQR = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevenir múltiplos cliques
    if (isSubmitting) {
      console.log("⚠️ Já está processando, ignorando clique duplo")
      return
    }

    setIsSubmitting(true)
    setIsUploadingFirebase(true)
    setUploadProgress("Iniciando...")

    try {
      // 1. Tentar salvar no Firebase (com fallback)
      if (memorial && !firebaseError) {
        console.log("🔥 Tentando salvar no Firebase...")
        setUploadProgress("Conectando ao Firebase...")

        try {
          const { salvarSolicitacaoQRCode } = await import("@/lib/firestore")
          const memorialUrl = window.location.href
          setUploadProgress("Salvando dados e fotos...")

          const docId = await salvarSolicitacaoQRCode(memorial, solicitante, memorialUrl)
          console.log("✅ Dados salvos no Firebase com sucesso! ID:", docId)
          setUploadProgress("✅ Dados salvos com sucesso!")
        } catch (firebaseError: any) {
          console.warn("⚠️ Erro no Firebase, usando fallback:", firebaseError)
          setFirebaseError("Erro no Firebase - usando fallback")
          setUploadProgress("⚠️ Usando método alternativo...")
        }
      } else {
        console.log("⚠️ Firebase não disponível, usando apenas email")
        setUploadProgress("Preparando envio direto...")
      }

      // 2. Continuar com email (sempre funciona)
      setUploadProgress("Preparando envio de email...")

      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

      // Sempre usar fallback de email para garantir funcionamento
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

STATUS: ${memorial?.validado ? "✅ MEMORIAL VALIDADO (completo)" : "⚠️ Memorial não validado (incompleto)"}

${firebaseError ? "⚠️ Dados enviados via email (Firebase indisponível)" : "✅ Dados salvos no Firebase"}

Por favor, entre em contato para solicitar o QR Code.`

      if (publicKey && serviceId && templateId) {
        try {
          console.log("📧 Tentando enviar via EmailJS...")
          setUploadProgress("Enviando email...")

          const emailjs = await import("@emailjs/browser")
          emailjs.default.init(publicKey)

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

          await emailjs.default.send(serviceId, templateId, templateParams)
          console.log("✅ Email enviado via EmailJS")
          setUploadProgress("✅ Email enviado!")

          alert("🎉 SUCESSO!\n\n✅ Solicitação enviada com sucesso!\n📧 Entraremos em contato em breve.")
        } catch (emailError) {
          console.warn("⚠️ Erro no EmailJS, usando fallback:", emailError)
          // Fallback para cliente de email
          const mailtoLink = `mailto:fredericoluna93@gmail.com?subject=Solicitação de QR Code - ${memorial?.nomeCompleto}&body=${encodeURIComponent(emailBody)}`

          // Usar window.location.href para iOS
          if (typeof window !== "undefined") {
            window.location.href = mailtoLink
          }

          alert(
            "🎉 SUCESSO!\n\n✅ Solicitação processada!\n📧 Seu cliente de email foi aberto com os dados preenchidos!",
          )
        }
      } else {
        // Sempre usar fallback de email se EmailJS não estiver configurado
        const mailtoLink = `mailto:fredericoluna93@gmail.com?subject=Solicitação de QR Code - ${memorial?.nomeCompleto}&body=${encodeURIComponent(emailBody)}`

        // Usar window.location.href para iOS
        if (typeof window !== "undefined") {
          window.location.href = mailtoLink
        }

        alert("🎉 SUCESSO!\n\n✅ Solicitação processada!\n📧 Seu cliente de email foi aberto com os dados preenchidos!")
      }

      // Limpar formulário
      setDialogOpen(false)
      setSolicitante({ nome: "", email: "", telefone: "" })
      setUploadProgress("")
    } catch (error: any) {
      console.error("❌ Erro geral:", error)

      // Fallback final - sempre funciona
      const emailBody = `Solicitação de QR Code - Remember QR Code (ERRO TÉCNICO)

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

ERRO TÉCNICO: ${error.message || error}

Por favor, entre em contato para solicitar o QR Code.`

      const mailtoLink = `mailto:fredericoluna93@gmail.com?subject=Solicitação de QR Code - ${memorial?.nomeCompleto}&body=${encodeURIComponent(emailBody)}`

      // Usar window.location.href para iOS
      if (typeof window !== "undefined") {
        window.location.href = mailtoLink
      }

      alert(
        "⚠️ Ocorreu um problema técnico, mas sua solicitação foi processada!\n\n📧 Seu cliente de email foi aberto com os dados preenchidos.",
      )
    } finally {
      setIsSubmitting(false)
      setIsUploadingFirebase(false)
      setTimeout(() => setUploadProgress(""), 3000)
    }
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Memorial não encontrado</p>
          <p className="text-slate-500 text-sm mb-4">
            {typeof Storage === "undefined"
              ? "⚠️ Storage não disponível neste navegador"
              : "Verifique se o link está correto"}
          </p>
          <Link href="/">
            <Button variant="outline">Voltar ao início</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Carregando memorial...</p>
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
          {/*{process.env.NODE_ENV === "development" && (
            <div className="mb-4">
              <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)} className="text-xs">
                {showDebug ? "Ocultar" : "Mostrar"} Debug
              </Button>
              {showDebug && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
                    <div className="mt-2 text-xs">
                      <strong>Status:</strong> {memorial.validado ? "✅ VALIDADO" : "⚠️ NÃO VALIDADO"}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}*/}
        </div>

        {/* Memorial Header */}
        <div className="text-center mb-12">
          <div className="w-31 h-31 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <img
              src="/logo-redonda.png"
              alt="logo remember"
            />
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

        {/* Campos Opcionais Preenchidos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {memorial.profissao && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-xl font-medium text-slate-700">Profissão</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{memorial.profissao}</p>
              </CardContent>
            </Card>
          )}

          {memorial.religiao && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Church className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-xl font-medium text-slate-700">Religião</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{memorial.religiao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {memorial.hobbies && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Heart className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-medium text-slate-700">Hobbies e Interesses</h3>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{memorial.hobbies}</p>
            </CardContent>
          </Card>
        )}

        {memorial.qualidades && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-medium text-slate-700">Qualidades Marcantes</h3>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{memorial.qualidades}</p>
            </CardContent>
          </Card>
        )}

        {memorial.jeito && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Smile className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-medium text-slate-700">Jeito de Ser</h3>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{memorial.jeito}</p>
            </CardContent>
          </Card>
        )}

        {memorial.frases && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-medium text-slate-700">Frases Marcantes</h3>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line italic">"{memorial.frases}"</p>
            </CardContent>
          </Card>
        )}

        {memorial.outrosDetalhes && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-medium text-slate-700">Outros Detalhes</h3>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{memorial.outrosDetalhes}</p>
            </CardContent>
          </Card>
        )}

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
                style={{
                  // Forçar estilos para iOS
                  WebkitAppearance: "none",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                }}
              >
                <QrCode className="w-6 h-6 mr-3" />
                Solicitar QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-light text-slate-700">Solicitar QR Code</DialogTitle>
              </DialogHeader>

              {/*VALIDATION*/}

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
                <Button
                  type="submit"
                  className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-gray-400"
                  disabled={isSubmitting}
                  style={{
                    // Forçar estilos para iOS
                    WebkitAppearance: "none",
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    touchAction: "manipulation",
                  }}
                >
                  {isUploadingFirebase
                    ? "Salvando no Firebase..."
                    : isSubmitting
                      ? "Enviando..."
                      : "Enviar Solicitação"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
