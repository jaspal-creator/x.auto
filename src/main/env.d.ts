/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_ENC_KEY: string;
  readonly MAIN_VITE_ENC_ALG: string;
  readonly MAIN_VITE_ENC_IV: string;
  readonly MAIN_VITE_SESS_EXPIRE: string;
  readonly MAIN_VITE_DB_NAME: string;
}

/* eslint-disable */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
/* eslint-enable */

declare module '*.png?asset' {
  const content: string;
  export default content;
}

declare module '*.jpg?asset' {
  const content: string;
  export default content;
}

declare module '*.svg?asset' {
  const content: string;
  export default content;
}
