import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getFirestoreInstance, getStorageInstance } from "./firebase"
import type { Firestore } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage"

// Interface para os dados do memorial
export interface MemorialData {
  nomeCompleto: string
  localSepultamento: string
  dataNascimento: string
  dataFalecimento: string
  biografia: string
  fotos: string[]
}

// Interface para dados do solicitante
export interface SolicitanteData {
  nome: string
  email: string
  telefone: string
}

// Interface para dados completos a serem salvos no Firestore
export interface SolicitacaoQRCode {
  // Dados do memorial
  memorial_nome_completo: string
  memorial_local_sepultamento: string
  memorial_data_nascimento: string
  memorial_data_falecimento: string
  memorial_biografia: string
  memorial_fotos_urls: string[]
  memorial_url: string

  // Dados do solicitante
  solicitante_nome: string
  solicitante_email: string
  solicitante_telefone: string

  // Metadados
  status: "pendente" | "processando" | "concluido"
  data_solicitacao: any // serverTimestamp
}

// Função para converter base64 para Blob
function base64ToBlob(base64: string, mimeType: string): Blob {
  try {
    const byteCharacters = atob(base64.split(",")[1])
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  } catch (error) {
    console.error("❌ Erro ao converter base64 para blob:", error)
    throw error
  }
}

// Função para fazer upload de uma foto para o Firebase Storage
async function uploadFoto(fotoBase64: string, nomeHomenageado: string, index: number): Promise<string> {
  try {
    console.log(`📤 Fazendo upload da foto ${index + 1}...`)

    // Obter instância do Storage
    const storage: FirebaseStorage = getStorageInstance()

    // Converter base64 para blob
    const blob = base64ToBlob(fotoBase64, "image/jpeg")

    // Criar referência no Storage
    const nomeArquivo = `${nomeHomenageado.replace(/[^a-zA-Z0-9]/g, "_")}_foto_${index + 1}_${Date.now()}.jpg`
    const storageRef = ref(storage, `fotos_homenageados/${nomeArquivo}`)

    console.log(`📁 Referência criada: fotos_homenageados/${nomeArquivo}`)

    // Fazer upload
    const snapshot = await uploadBytes(storageRef, blob)
    console.log(`✅ Upload da foto ${index + 1} concluído`)

    // Obter URL de download
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log(`🔗 URL da foto ${index + 1}:`, downloadURL)

    return downloadURL
  } catch (error) {
    console.error(`❌ Erro no upload da foto ${index + 1}:`, error)
    throw error
  }
}

// Função principal para salvar solicitação no Firestore
export async function salvarSolicitacaoQRCode(
  memorial: MemorialData,
  solicitante: SolicitanteData,
  memorialUrl: string,
): Promise<string> {
  try {
    console.log("🔥 Iniciando salvamento no Firebase...")

    // Obter instância do Firestore
    const db: Firestore = getFirestoreInstance()

    // 1. Upload das fotos para o Storage (se houver)
    const fotosUrls: string[] = []

    if (memorial.fotos && memorial.fotos.length > 0) {
      console.log(`📸 Fazendo upload de ${memorial.fotos.length} foto(s)...`)

      // Upload sequencial para evitar sobrecarga
      for (let i = 0; i < memorial.fotos.length; i++) {
        try {
          const url = await uploadFoto(memorial.fotos[i], memorial.nomeCompleto, i)
          fotosUrls.push(url)
        } catch (uploadError) {
          console.error(`❌ Erro no upload da foto ${i + 1}, continuando...`, uploadError)
          // Continua mesmo se uma foto falhar
        }
      }

      console.log(`✅ ${fotosUrls.length} foto(s) enviada(s) com sucesso!`)
    }

    // 2. Preparar dados para o Firestore
    const dadosSolicitacao: SolicitacaoQRCode = {
      // Dados do memorial
      memorial_nome_completo: memorial.nomeCompleto,
      memorial_local_sepultamento: memorial.localSepultamento,
      memorial_data_nascimento: memorial.dataNascimento,
      memorial_data_falecimento: memorial.dataFalecimento,
      memorial_biografia: memorial.biografia,
      memorial_fotos_urls: fotosUrls,
      memorial_url: memorialUrl,

      // Dados do solicitante
      solicitante_nome: solicitante.nome,
      solicitante_email: solicitante.email,
      solicitante_telefone: solicitante.telefone,

      // Metadados
      status: "pendente",
      data_solicitacao: serverTimestamp(),
    }

    console.log("💾 Salvando dados no Firestore...")
    console.log("📋 Dados a serem salvos:", {
      ...dadosSolicitacao,
      memorial_fotos_urls: `${fotosUrls.length} foto(s)`,
    })

    // 3. Salvar no Firestore
    const docRef = await addDoc(collection(db, "solicitacoes_qrcode"), dadosSolicitacao)

    console.log("✅ Solicitação salva no Firestore com ID:", docRef.id)

    return docRef.id
  } catch (error) {
    console.error("❌ Erro ao salvar solicitação:", error)
    throw error
  }
}
