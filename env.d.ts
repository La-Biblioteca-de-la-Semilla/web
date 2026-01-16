/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // añadir otras variables si es necesario
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
