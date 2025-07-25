"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, ArrowLeft } from "lucide-react"
import { ChristianCross } from "@/components/ui/christian-cross"
import Link from "next/link"

interface MemorialData {
  nomeCompleto: string
  localSepultamento: string
  dataNascimento: string
  dataFalecimento: string
  biografia: string
  fotos: string[]
}

export default function CriarMemorialPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<MemorialData>({
    nomeCompleto: "",
    localSepultamento: "",
    dataNascimento: "",
    dataFalecimento: "",
    biografia: "",
    fotos: [],
  })

  const handleInputChange = (field: keyof MemorialData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (formData.fotos.length >= 10) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData((prev) => ({
          ...prev,
          fotos: [...prev.fotos, result],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a simple ID
    const memorialId = Date.now().toString()

    // Save to localStorage
    localStorage.setItem(`memorial_${memorialId}`, JSON.stringify(formData))

    // Redirect to memorial page
    router.push(`/memorial/${memorialId}`)
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <ChristianCross className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-slate-800 mb-2">Criar Memorial</h1>
              <div className="w-16 h-1 bg-blue-300 rounded-full"></div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-slate-700">Informações do Memorial</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Biografia */}
              <div className="space-y-2">
                <Label htmlFor="biografia" className="text-slate-700">
                  Biografia ou Mensagem Final *
                </Label>
                <Textarea
                  id="biografia"
                  value={formData.biografia}
                  onChange={(e) => handleInputChange("biografia", e.target.value)}
                  placeholder="Conte um pouco sobre a vida desta pessoa especial, suas qualidades, conquistas e o que ela representava para família e amigos..."
                  required
                  className="min-h-[120px] border-slate-200 focus:border-blue-300"
                />
              </div>

              {/* Upload de Fotos */}
              <div className="space-y-4">
                <Label className="text-slate-700">Galeria de Fotos (até 10 fotos)</Label>

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
                      className="cursor-pointer bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-full transition-colors"
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
              </div>

              {/* Botão Submit */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white py-4 text-lg rounded-full"
                >
                  Gerar Memorial
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
