declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_BASE_URL: string;
  }
}

interface ImportMetaEnv {
  VITE_APP_API_BASE_URL: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
