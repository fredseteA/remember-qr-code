import Link from "next/link"
import { ArrowLeft, ExternalLink, Mail, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl md:text-4xl font-light text-slate-800 mb-2">Configuração</h1>
          <div className="w-16 h-1 bg-blue-300 rounded-full"></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuração do EmailJS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Para que o envio de emails funcione automaticamente, você precisa configurar o EmailJS. Caso contrário,
                o sistema abrirá seu cliente de email padrão.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-semibold text-lg mb-2">Passo 1: Criar conta no EmailJS</h3>
                <p className="text-gray-600 mb-2">
                  Acesse{" "}
                  <a
                    href="https://www.emailjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center gap-1"
                  >
                    EmailJS.com <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  e crie uma conta gratuita.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-semibold text-lg mb-2">Passo 2: Configurar Serviço de Email</h3>
                <p className="text-gray-600 mb-2">
                  No dashboard, vá em{" "}
                  <a
                    href="https://dashboard.emailjs.com/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center gap-1"
                  >
                    Email Services <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  e conecte seu Gmail, Outlook ou outro provedor.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-semibold text-lg mb-2">Passo 3: Criar Template de Email</h3>
                <p className="text-gray-600 mb-2">
                  Vá em{" "}
                  <a
                    href="https://dashboard.emailjs.com/admin/templates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center gap-1"
                  >
                    Email Templates <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  e crie um template com as seguintes variáveis:
                </p>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  <div>Para: fredericoluna93@gmail.com</div>
                  <div>Assunto: Solicitação QR Code - {`{{memorial_nome}}`}</div>
                  <div className="mt-2">Corpo do email:</div>
                  <div className="whitespace-pre-line text-xs mt-1">
                    {`Solicitação de QR Code

SOLICITANTE:
Nome: {{solicitante_nome}}
Email: {{solicitante_email}}
Telefone: {{solicitante_telefone}}

MEMORIAL:
Nome: {{memorial_nome}}
Local: {{memorial_local}}
Nascimento: {{memorial_nascimento}}
Falecimento: {{memorial_falecimento}}
URL: {{memorial_url}}`}
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-semibold text-lg mb-2">Passo 4: Obter as Chaves</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    • <strong>Public Key:</strong>{" "}
                    <a
                      href="https://dashboard.emailjs.com/admin/account"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Account → Public Key
                    </a>
                  </li>
                  <li>
                    • <strong>Service ID:</strong> Na página de serviços, copie o ID do seu serviço
                  </li>
                  <li>
                    • <strong>Template ID:</strong> Na página de templates, copie o ID do template criado
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="font-semibold text-lg mb-2">Passo 5: Configurar no Projeto</h3>
                <p className="text-gray-600 mb-2">
                  Crie um arquivo <code className="bg-gray-100 px-1 rounded">.env.local</code> na raiz do projeto:
                </p>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  <div>NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=sua_chave_publica</div>
                  <div>NEXT_PUBLIC_EMAILJS_SERVICE_ID=seu_service_id</div>
                  <div>NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=seu_template_id</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
