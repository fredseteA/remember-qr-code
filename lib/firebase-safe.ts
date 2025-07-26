// Versão segura do Firebase que não quebra em dispositivos problemáticos
import type { FirebaseApp } from "firebase/app"
import type { Firestore } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage"

let firebaseApp: FirebaseApp | null = null
let firestore: Firestore | null = null
let storage: FirebaseStorage | null = null

export async function initializeFirebaseSafe(): Promise<{
  app: FirebaseApp | null
  db: Firestore | null
  storage: FirebaseStorage | null
}> {
  try {
    // Verificar se estamos no cliente
    if (typeof window === "undefined") {
      console.log("⚠️ Firebase: Executando no servidor, pulando inicialização")
      return { app: null, db: null, storage: null }
    }

    // Verificar se já foi inicializado
    if (firebaseApp && firestore && storage) {
      console.log("✅ Firebase: Usando instâncias existentes")
      return { app: firebaseApp, db: firestore, storage }
    }

    console.log("🔥 Firebase: Inicializando de forma segura...")

    // Importar dinamicamente
    const { initializeApp, getApps, getApp } = await import("firebase/app")
    const { getFirestore } = await import("firebase/firestore")
    const { getStorage } = await import("firebase/storage")

    const firebaseConfig = {
      apiKey: "AIzaSyDg89g4Jb0kcaIePi-iY1RFQa2gUAqPLQA",
      authDomain: "remember-qr-code.firebaseapp.com",
      projectId: "remember-qr-code",
      storageBucket: "remember-qr-code.firebasestorage.app",
      messagingSenderId: "77579866541",
      appId: "1:77579866541:web:45e3c4fe81179d12d75124",
    }

    // Inicializar app
    if (getApps().length > 0) {
      firebaseApp = getApp()
    } else {
      firebaseApp = initializeApp(firebaseConfig)
    }

    // Inicializar serviços
    firestore = getFirestore(firebaseApp)
    storage = getStorage(firebaseApp)

    console.log("✅ Firebase: Inicializado com sucesso")
    return { app: firebaseApp, db: firestore, storage }
  } catch (error) {
    console.warn("⚠️ Firebase: Erro na inicialização, continuando sem Firebase:", error)
    return { app: null, db: null, storage: null }
  }
}

export async function salvarSolicitacaoSafe(
  memorial: any,
  solicitante: any,
  memorialUrl: string,
): Promise<string | null> {
  try {
    const { db } = await initializeFirebaseSafe()

    if (!db) {
      console.log("⚠️ Firestore não disponível, pulando salvamento")
      return null
    }

    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

    const dadosSolicitacao = {
      memorial_nome_completo: memorial.nomeCompleto,
      memorial_local_sepultamento: memorial.localSepultamento,
      memorial_data_nascimento: memorial.dataNascimento,
      memorial_data_falecimento: memorial.dataFalecimento,
      memorial_biografia: memorial.biografia,
      memorial_fotos_urls: [], // Sem upload de fotos para simplificar
      memorial_url: memorialUrl,
      solicitante_nome: solicitante.nome,
      solicitante_email: solicitante.email,
      solicitante_telefone: solicitante.telefone,
      status: "pendente",
      data_solicitacao: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "solicitacoes_qrcode"), dadosSolicitacao)
    console.log("✅ Dados salvos no Firestore:", docRef.id)
    return docRef.id
  } catch (error) {
    console.warn("⚠️ Erro ao salvar no Firestore:", error)
    return null
  }
}
