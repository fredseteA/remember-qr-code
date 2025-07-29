"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, ArrowLeft, AlertCircle } from "lucide-react"
import { ChristianCross } from "@/components/ui/christian-cross"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface MemorialData {
  nomeCompleto: string
  localSepultamento: string
  dataNascimento: string
  dataFalecimento: string
  biografia: string
  fotos: string[]
  // Novos campos opcionais
  hobbies?: string
  profissao?: string
  religiao?: string
  frases?: string
  qualidades?: string
  jeito?: string
  outrosDetalhes?: string
  validado: boolean
}

export default function CriarMemorialPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<MemorialData>({
    nomeCompleto: "",
    localSepultamento: "",
    dataNascimento: "",
    dataFalecimento: "",
    biografia: "",
    fotos: [],
    hobbies: "",
    profissao: "",
    religiao: "",
    frases: "",
    qualidades: "",
    jeito: "",
    outrosDetalhes: "",
    validado: false,
  })

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [camposOpcionaisPreenchidos, setCamposOpcionaisPreenchidos] = useState(0)

  // Garantir que estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Contar campos opcionais preenchidos
  useEffect(() => {
    const camposOpcionais = [
      formData.hobbies,
      formData.profissao,
      formData.religiao,
      formData.frases,
      formData.qualidades,
      formData.jeito,
      formData.outrosDetalhes,
    ]

    const preenchidos = camposOpcionais.filter((campo) => campo && campo.trim().length > 0).length
    setCamposOpcionaisPreenchidos(preenchidos)
  }, [formData])

  const handleInputChange = (field: keyof MemorialData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Função melhorada para upload de fotos com compatibilidade iOS
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    console.log("📸 Iniciando upload de fotos...")

    Array.from(files).forEach((file, index) => {
      if (formData.fotos.length >= 10) {
        console.warn("⚠️ Limite de 10 fotos atingido")
        return
      }

      // Verificar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        console.warn("⚠️ Arquivo não é uma imagem:", file.name)
        return
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const result = e.target?.result as string
          if (result) {
            console.log(`✅ Foto ${index + 1} carregada com sucesso`)
            setFormData((prev) => ({
              ...prev,
              fotos: [...prev.fotos, result],
            }))
          }
        } catch (error) {
          console.error("❌ Erro ao processar foto:", error)
        }
      }

      reader.onerror = (error) => {
        console.error("❌ Erro ao ler arquivo:", error)
      }

      reader.readAsDataURL(file)
    })

    // Limpar input para permitir re-upload do mesmo arquivo
    event.target.value = ""
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): boolean => {
    const errors: string[] = []

    // 1. Biografia deve ter pelo menos 500 caracteres
    if (formData.biografia.trim().length < 500) {
      errors.push(`Biografia deve ter pelo menos 500 caracteres (atual: ${formData.biografia.trim().length})`)
    }

    // 2. Deve haver pelo menos uma foto
    if (formData.fotos.length === 0) {
      errors.push("Deve haver pelo menos uma foto")
    }

    // 3. Pelo menos 3 campos opcionais preenchidos
    if (camposOpcionaisPreenchidos < 3) {
      errors.push(`Preencha pelo menos 3 campos opcionais (atual: ${camposOpcionaisPreenchidos})`)
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  // Função melhorada para compatibilidade iOS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevenir múltiplos cliques
    if (isSubmitting) {
      console.log("⚠️ Já está processando, ignorando clique duplo")
      return
    }

    console.log("🚀 Iniciando processo de criação do memorial...")
    setIsSubmitting(true)

    try {
      // Validar formulário
      console.log("🔍 Validando formulário...")
      const isValid = validateForm()
      console.log("📊 Resultado da validação:", isValid ? "✅ VÁLIDO" : "❌ INVÁLIDO")

      // Verificar se localStorage está disponível (iOS pode bloquear em modo privado)
      if (typeof window === "undefined") {
        throw new Error("Window não disponível")
      }

      if (typeof Storage === "undefined") {
        throw new Error("localStorage não suportado neste navegador")
      }

      // Generate a simple ID
      const memorialId = Date.now().toString()
      console.log("🆔 ID do memorial gerado:", memorialId)

      // Preparar dados com validação
      const memorialDataToSave: MemorialData = {
        ...formData,
        validado: isValid,
      }

      console.log("💾 Tentando salvar no localStorage...")

      // Tentar salvar no localStorage com tratamento de erro específico para iOS
      try {
        const dataString = JSON.stringify(memorialDataToSave)
        localStorage.setItem(`memorial_${memorialId}`, dataString)

        // Verificar se realmente foi salvo
        const savedData = localStorage.getItem(`memorial_${memorialId}`)
        if (!savedData) {
          throw new Error("Dados não foram salvos corretamente")
        }

        console.log("✅ Memorial salvo no localStorage:", memorialId)
        console.log("📊 Status de validação:", isValid ? "VALIDADO" : "NÃO VALIDADO")
      } catch (storageError) {
        console.error("❌ Erro ao salvar no localStorage:", storageError)

        // Fallback: usar sessionStorage
        try {
          console.log("🔄 Tentando sessionStorage como fallback...")
          sessionStorage.setItem(`memorial_${memorialId}`, JSON.stringify(memorialDataToSave))
          console.log("✅ Memorial salvo no sessionStorage")
        } catch (sessionError) {
          console.error("❌ Erro também no sessionStorage:", sessionError)
          throw new Error("Não foi possível salvar os dados. Verifique se o modo privado está desabilitado.")
        }
      }

      console.log("🔄 Redirecionando para página do memorial...")

      // Usar setTimeout para garantir que o estado seja atualizado antes do redirect
      setTimeout(() => {
        router.push(`/memorial/${memorialId}`)
      }, 100)
    } catch (error: any) {
      console.error("❌ Erro ao criar memorial:", error)
      setIsSubmitting(false)

      // Mostrar erro específico para o usuário
      const errorMessage = error.message || "Erro desconhecido ao criar memorial"
      alert(
        `❌ Erro ao criar memorial:\n\n${errorMessage}\n\nTente novamente ou verifique se o modo privado está desabilitado.`,
      )
    }
  }

  // Não renderizar até estar no cliente
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Carregando...</p>
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-29 h-29 bg-blue-100 rounded-full flex items-center justify-center">
              <img
                src="/logo-redonda.png"
                alt="logo-remember"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-slate-800 mb-2">Criar Memorial</h1>
              <div className="w-16 h-1 bg-blue-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Alertas de Validação */}
        {validationErrors.length > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Para criar um memorial completo, você precisa:</strong>
              <ul className="mt-2 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">
                    • {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Status de Progresso */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-white/70">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{formData.biografia.trim().length}</div>
              <div className="text-sm text-slate-500">caracteres na biografia</div>
              <div className="text-xs text-slate-400">(mínimo: 500)</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white/70">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{formData.fotos.length}</div>
              <div className="text-sm text-slate-500">fotos adicionadas</div>
              <div className="text-xs text-slate-400">(mínimo: 1)</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white/70">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{camposOpcionaisPreenchidos}</div>
              <div className="text-sm text-slate-500">campos opcionais</div>
              <div className="text-xs text-slate-400">(mínimo: 3)</div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-light text-slate-700">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto" className="text-slate-700">
                  Nome Completo *
                </Label>
                <Input
                  id="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                  className="border-slate-200 focus:border-blue-300"
                />
              </div>

              {/* Local de Sepultamento */}
              <div className="space-y-2">
                <Label htmlFor="localSepultamento" className="text-slate-700">
                  Local de Sepultamento *
                </Label>
                <Input
                  id="localSepultamento"
                  value={formData.localSepultamento}
                  onChange={(e) => handleInputChange("localSepultamento", e.target.value)}
                  placeholder="Ex: Cemitério São João Batista, Quadra 15, Jazigo 123"
                  required
                  className="border-slate-200 focus:border-blue-300"
                />
              </div>

              {/* Datas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento" className="text-slate-700">
                    Data de Nascimento *
                  </Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                    required
                    className="border-slate-200 focus:border-blue-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataFalecimento" className="text-slate-700">
                    Data de Falecimento *
                  </Label>
                  <Input
                    id="dataFalecimento"
                    type="date"
                    value={formData.dataFalecimento}
                    onChange={(e) => handleInputChange("dataFalecimento", e.target.value)}
                    required
                    className="border-slate-200 focus:border-blue-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ajuda para escrever a biografia */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-light text-slate-700">Ajuda para escrever a biografia</CardTitle>
              <p className="text-slate-600 text-sm">
                Preencha os campos abaixo para nos ajudar a conhecer melhor essa pessoa especial. Todos os campos são{" "}
                <strong>opcionais</strong>, mas recomendamos preencher pelo menos 3 para criar um memorial mais
                completo.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Profissão */}
                <div className="space-y-2">
                  <Label htmlFor="profissao" className="text-slate-700">
                    Profissão
                  </Label>
                  <Input
                    id="profissao"
                    value={formData.profissao}
                    onChange={(e) => handleInputChange("profissao", e.target.value)}
                    placeholder="Ex: Professora, Engenheiro, Aposentado..."
                    className="border-slate-200 focus:border-blue-300"
                  />
                </div>

                {/* Religião */}
                <div className="space-y-2">
                  <Label htmlFor="religiao" className="text-slate-700">
                    Religião ou crença
                  </Label>
                  <Input
                    id="religiao"
                    value={formData.religiao}
                    onChange={(e) => handleInputChange("religiao", e.target.value)}
                    placeholder="Ex: Católica, Evangélica, Espírita..."
                    className="border-slate-200 focus:border-blue-300"
                  />
                </div>
              </div>

              {/* Hobbies */}
              <div className="space-y-2">
                <Label htmlFor="hobbies" className="text-slate-700">
                  Hobbies e interesses
                </Label>
                <Textarea
                  id="hobbies"
                  value={formData.hobbies}
                  onChange={(e) => handleInputChange("hobbies", e.target.value)}
                  placeholder="Ex: Gostava de cozinhar, ler livros, cuidar do jardim, jogar cartas com os amigos..."
                  className="border-slate-200 focus:border-blue-300"
                  rows={3}
                />
              </div>

              {/* Qualidades */}
              <div className="space-y-2">
                <Label htmlFor="qualidades" className="text-slate-700">
                  Qualidades marcantes
                </Label>
                <Textarea
                  id="qualidades"
                  value={formData.qualidades}
                  onChange={(e) => handleInputChange("qualidades", e.target.value)}
                  placeholder="Ex: Era muito generosa, sempre ajudava os vizinhos, tinha um sorriso contagiante..."
                  className="border-slate-200 focus:border-blue-300"
                  rows={3}
                />
              </div>

              {/* Jeito da pessoa */}
              <div className="space-y-2">
                <Label htmlFor="jeito" className="text-slate-700">
                  Descrição do jeito da pessoa
                </Label>
                <Textarea
                  id="jeito"
                  value={formData.jeito}
                  onChange={(e) => handleInputChange("jeito", e.target.value)}
                  placeholder="Ex: Era uma pessoa calma e paciente, sempre otimista, gostava de contar histórias..."
                  className="border-slate-200 focus:border-blue-300"
                  rows={3}
                />
              </div>

              {/* Frases */}
              <div className="space-y-2">
                <Label htmlFor="frases" className="text-slate-700">
                  Frases que a pessoa dizia com frequência
                </Label>
                <Textarea
                  id="frases"
                  value={formData.frases}
                  onChange={(e) => handleInputChange("frases", e.target.value)}
                  placeholder='Ex: "Tudo vai dar certo", "A família é o mais importante", "Cada dia é uma bênção"...'
                  className="border-slate-200 focus:border-blue-300"
                  rows={3}
                />
              </div>

              {/* Outros detalhes */}
              <div className="space-y-2">
                <Label htmlFor="outrosDetalhes" className="text-slate-700">
                  Outros detalhes importantes
                </Label>
                <Textarea
                  id="outrosDetalhes"
                  value={formData.outrosDetalhes}
                  onChange={(e) => handleInputChange("outrosDetalhes", e.target.value)}
                  placeholder="Qualquer outra informação que você gostaria de compartilhar sobre essa pessoa especial..."
                  className="border-slate-200 focus:border-blue-300"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload de Fotos */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-light text-slate-700">Galeria de Fotos *</CardTitle>
              <p className="text-slate-600 text-sm">Adicione pelo menos uma foto para criar o memorial.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.fotos.length < 10 && (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-300 transition-colors">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">Clique para adicionar fotos ou arraste aqui</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label
                    htmlFor="photo-upload"
                    className="cursor-pointer bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-full transition-colors inline-block"
                  >
                    Selecionar Fotos
                  </Label>
                </div>
              )}

              {/* Preview das fotos */}
              {formData.fotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.fotos.map((foto, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={foto || "/placeholder.svg"}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Biografia Final */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-light text-slate-700">Biografia Final *</CardTitle>
              <p className="text-slate-600 text-sm">
                Escreva aqui o texto final que será exibido no memorial. Use as informações dos campos acima para criar
                uma biografia completa e carinhosa. <strong>Mínimo de 500 caracteres.</strong>
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="biografia" className="text-slate-700">
                  Biografia ou Mensagem Final *
                </Label>
                <Textarea
                  id="biografia"
                  value={formData.biografia}
                  onChange={(e) => handleInputChange("biografia", e.target.value)}
                  placeholder="Conte a história de vida desta pessoa especial, suas qualidades, conquistas e o que ela representava para família e amigos. Use as informações preenchidas acima para criar um texto completo e emocionante..."
                  required
                  className="min-h-[200px] border-slate-200 focus:border-blue-300"
                />
                <div className="text-right text-sm text-slate-500">
                  {formData.biografia.trim().length}/500 caracteres mínimos
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão Submit - Melhorado para iOS */}
          <div className="pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 text-lg rounded-full transition-all duration-200"
              style={{
                // Forçar estilos para iOS
                WebkitAppearance: "none",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                touchAction: "manipulation",
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Gerando Memorial...
                </>
              ) : (
                "Gerar Memorial"
              )}
            </Button>

            {/* Debug info para desenvolvimento */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 text-xs text-gray-500 text-center">
                Debug: {typeof Storage !== "undefined" ? "✅ Storage OK" : "❌ Storage não disponível"} |
                {typeof window !== "undefined" ? "✅ Window OK" : "❌ Window não disponível"}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
