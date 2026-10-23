import type { MeteredSettings } from './iceServers'

const SESSION_KEY = 'quickscreen-metered-session'
const LOCAL_KEY = 'quickscreen-metered-local'

export type PresenterSettingsSelection = {
  settings?: MeteredSettings
  remember: boolean
}

function readKey(storage: Storage, key: string, remember: boolean): PresenterSettingsSelection | undefined {
  try {
    const stored = storage.getItem(key)
    if (!stored) return undefined
    const value = JSON.parse(stored) as Partial<MeteredSettings>
    if (typeof value.appName !== 'string' || typeof value.credentialApiKey !== 'string') return undefined
    return { settings: { appName: value.appName, credentialApiKey: value.credentialApiKey }, remember }
  } catch {
    return undefined
  }
}

export function readPresenterSettings(): PresenterSettingsSelection {
  try {
    return readKey(sessionStorage, SESSION_KEY, false) ?? readKey(localStorage, LOCAL_KEY, true) ?? { remember: false }
  } catch {
    return { remember: false }
  }
}

export function savePresenterSettings(settings: MeteredSettings, remember: boolean): boolean {
  try {
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(LOCAL_KEY)
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(remember ? LOCAL_KEY : SESSION_KEY, JSON.stringify(settings))
    return true
  } catch {
    return false
  }
}

export function resetPresenterSettings(): boolean {
  try {
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(LOCAL_KEY)
    return true
  } catch {
    return false
  }
}
