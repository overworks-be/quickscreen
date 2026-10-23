/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_METERED_APP?: string
  readonly VITE_METERED_CREDENTIAL_API_KEY?: string
  readonly VITE_WEBRTC_FORCE_RELAY?: string
}
