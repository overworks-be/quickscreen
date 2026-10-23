export const PUBLIC_STUN_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
]

export type MeteredSettings = {
  appName: string
  credentialApiKey: string
}

export type IceConfiguration = {
  rtcConfiguration: RTCConfiguration
  turnAvailable: boolean
  forceRelay: boolean
  notice?: string
}

export type MeteredTestResult =
  | { ok: true; serverCount: number }
  | { ok: false; message: string }

let cachedPresenterSettings = ''
let cachedPresenterServers: Promise<RTCIceServer[]> | undefined

function isTurnServer(server: RTCIceServer): boolean {
  const urls = typeof server.urls === 'string' ? [server.urls] : server.urls
  return urls.some((url) => /^turns?:/i.test(url))
}

function validateSettings(settings: MeteredSettings): void {
  if (!/^[a-z0-9-]+$/i.test(settings.appName.trim())) throw new Error('Le domaine de l’application Metered est invalide.')
  if (!settings.credentialApiKey.trim()) throw new Error('Indique la Credential API Key TURN.')
}

function validateIceServers(value: unknown): RTCIceServer[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error('Metered a renvoyé une liste de serveurs ICE invalide.')

  const servers = value.map((item): RTCIceServer => {
    if (!item || typeof item !== 'object') throw new Error('Metered a renvoyé une entrée de serveur ICE invalide.')
    const server = item as Record<string, unknown>
    const urls = server.urls
    const list = typeof urls === 'string' ? [urls] : urls
    if (!Array.isArray(list) || list.length === 0 || !list.every((url) => typeof url === 'string' && /^(stun|stuns|turn|turns):/i.test(url))) {
      throw new Error('Metered a renvoyé une URL de serveur ICE invalide.')
    }
    const hasTurnUrl = list.some((url) => /^turns?:/i.test(url as string))
    if (hasTurnUrl && (typeof server.username !== 'string' || typeof server.credential !== 'string')) {
      throw new Error('Les identifiants du relais TURN Metered sont absents.')
    }
    return {
      urls: urls as string | string[],
      ...(typeof server.username === 'string' ? { username: server.username } : {}),
      ...(typeof server.credential === 'string' ? { credential: server.credential } : {}),
      ...(server.credentialType === 'password' || server.credentialType === 'oauth' ? { credentialType: server.credentialType } : {}),
    }
  })

  if (!servers.some(isTurnServer)) throw new Error('Metered n’a renvoyé aucun serveur TURN.')
  return servers
}

async function requestMeteredServers(settings: MeteredSettings): Promise<RTCIceServer[]> {
  validateSettings(settings)
  const endpoint = new URL(`https://${settings.appName.trim()}.metered.live/api/v1/turn/credentials`)
  endpoint.searchParams.set('apiKey', settings.credentialApiKey.trim())
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(endpoint, { signal: controller.signal })
    if (response.status === 401 || response.status === 403) throw new Error('La Credential API Key Metered a été refusée.')
    if (!response.ok) throw new Error(`La requête Metered a échoué (HTTP ${response.status}).`)
    return validateIceServers(await response.json())
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('La requête Metered a dépassé le délai autorisé.')
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

function getCachedPresenterServers(settings: MeteredSettings): Promise<RTCIceServer[]> {
  const settingsKey = `${settings.appName.trim()}\u0000${settings.credentialApiKey.trim()}`
  if (cachedPresenterSettings !== settingsKey || !cachedPresenterServers) {
    cachedPresenterSettings = settingsKey
    cachedPresenterServers = requestMeteredServers(settings).catch((error: unknown) => {
      if (cachedPresenterSettings === settingsKey) {
        cachedPresenterSettings = ''
        cachedPresenterServers = undefined
      }
      throw error
    })
  }
  return cachedPresenterServers
}

export async function testMeteredSettings(settings: MeteredSettings): Promise<MeteredTestResult> {
  try {
    validateSettings(settings)
    const servers = await getCachedPresenterServers(settings)
    return { ok: true, serverCount: servers.length }
  } catch (error) {
    if (error instanceof TypeError) return { ok: false, message: 'Impossible de joindre Metered. Vérifie le domaine, le réseau et la connexion au service.' }
    return { ok: false, message: error instanceof Error ? error.message : 'Impossible de joindre Metered.' }
  }
}

export async function loadPresenterIceConfiguration(
  settings: MeteredSettings | undefined,
  forceRelay: boolean,
): Promise<IceConfiguration> {
  try {
    if (!settings?.appName.trim() || !settings.credentialApiKey.trim()) throw new Error('Le relais Metered TURN n’est pas configuré.')
    const iceServers = await getCachedPresenterServers(settings)
    return { rtcConfiguration: { iceServers, iceTransportPolicy: forceRelay ? 'relay' : 'all' }, turnAvailable: true, forceRelay }
  } catch {
    return {
      rtcConfiguration: { iceServers: PUBLIC_STUN_SERVERS, iceTransportPolicy: forceRelay ? 'relay' : 'all' },
      turnAvailable: false,
      forceRelay,
      notice: forceRelay
        ? 'Mode diagnostic relais uniquement activé, mais Metered TURN est indisponible. La connexion échouera tant que le relais n’est pas configuré.'
        : 'Relais TURN indisponible. La connexion directe reste possible selon votre réseau.',
    }
  }
}

export function loadVisitorIceConfiguration(): IceConfiguration {
  return {
    rtcConfiguration: { iceServers: PUBLIC_STUN_SERVERS, iceTransportPolicy: 'all' },
    turnAvailable: false,
    forceRelay: false,
  }
}
