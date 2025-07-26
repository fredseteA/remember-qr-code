import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDg89g4Jb0kcaIePi-iY1RFQa2gUAqPLQA",
  authDomain: "remember-qr-code.firebaseapp.com",
  projectId: "remember-qr-code",
  storageBucket: "remember-qr-code.firebasestorage.app",
  messagingSenderId: "77579866541",
  appId: "1:77579866541:web:45e3c4fe81179d12d75124",
}

// Função para inicializar Firebase de forma segura
function initializeFirebase(): FirebaseApp {
  try {
    // Verificar se já existe uma instância
    if (getApps().length > 0) {
      console.log("✅ Firebase já inicializado, usando instância existente")
      return getApp()
    }

    console.log("🔥 Inicializando Firebase pela primeira vez...")
    const app = initializeApp(firebaseConfig)
    console.log("✅ Firebase inicializado com sucesso")
    return app
  } catch (error) {
    console.error("❌ Erro ao inicializar Firebase:", error)
    throw error
  }
}

// Função para obter Firestore de forma segura
function getFirestoreInstance(): Firestore {
  try {
    const app = initializeFirebase()
    const db = getFirestore(app)
    console.log("✅ Firestore inicializado com sucesso")
    return db
  } catch (error) {
    console.error("❌ Erro ao inicializar Firestore:", error)
    throw error
  }
}

// Função para obter Storage de forma segura
function getStorageInstance(): FirebaseStorage {
  try {
    const app = initializeFirebase()
    const storage = getStorage(app)
    console.log("✅ Storage inicializado com sucesso")
    return storage
  } catch (error) {
    console.error("❌ Erro ao inicializar Storage:", error)
    throw error
  }
}

// Exportar as funções em vez das instâncias
export { getFirestoreInstance, getStorageInstance, initializeFirebase }

// Exportar uma instância padrão para compatibilidade
let app: FirebaseApp
try {
  app = initializeFirebase()
} catch (error) {
  console.error("❌ Erro na inicialização padrão do Firebase:", error)
  throw error
}

export default app
