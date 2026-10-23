const FALLBACK_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
]

export type IceConfiguration = {
  rtcConfiguration: RTCConfiguration
  turnAvailable: boolean
  forceRelay: boolean
  notice?: string
}

let cachedConfiguration: Promise<IceConfiguration> | undefined

function isTurnServer(server: RTCIceServer): boolean {
  const urls = typeof server.urls === 'string' ? [server.urls] : server.urls
  return urls.some((url) => /^turns?:/i.test(url))
}

function validateIceServers(value: unknown): RTCIceServer[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error('Invalid ICE server response')

  const servers = value.map((item): RTCIceServer => {
    if (!item || typeof item !== 'object') throw new Error('Invalid ICE server entry')
    const server = item as Record<string, unknown>
    const urls = server.urls
    const list = typeof urls === 'string' ? [urls] : urls
    if (!Array.isArray(list) || list.length === 0 || !list.every((url) => typeof url === 'string' && /^(stun|stuns|turn|turns):/i.test(url))) {
      throw new Error('Invalid ICE server URL')
    }
    const hasTurnUrl = list.some((url) => /^turns?:/i.test(url as string))
    if (hasTurnUrl && (typeof server.username !== 'string' || typeof server.credential !== 'string')) {
      throw new Error('TURN credentials are missing')
    }
    return {
      urls: urls as string | string[],
      ...(typeof server.username === 'string' ? { username: server.username } : {}),
      ...(typeof server.credential === 'string' ? { credential: server.credential } : {}),
      ...(server.credentialType === 'password' || server.credentialType === 'oauth' ? { credentialType: server.credentialType } : {}),
    }
  })

  if (!servers.some(isTurnServer)) throw new Error('Metered did not return a TURN server')
  return servers
}

async function fetchMeteredServers(): Promise<RTCIceServer[]> {
  const appName = import.meta.env.VITE_METERED_APP?.trim()
  const apiKey = import.meta.env.VITE_METERED_CREDENTIAL_API_KEY?.trim()
  if (!appName || !apiKey) throw new Error('Metered TURN is not configured')
  if (!/^[a-z0-9-]+$/i.test(appName)) throw new Error('Invalid Metered application name')

  const endpoint = new URL(`https://${appName}.metered.live/api/v1/turn/credentials`)
  endpoint.searchParams.set('apiKey', apiKey)
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(endpoint, { signal: controller.signal })
    if (!response.ok) throw new Error(`Metered returned HTTP ${response.status}`)
    return validateIceServers(await response.json())
  } finally {
    window.clearTimeout(timeout)
  }
}

async function resolveConfiguration(): Promise<IceConfiguration> {
  const forceRelay = import.meta.env.VITE_WEBRTC_FORCE_RELAY?.trim().toLowerCase() === 'true'
  try {
    const iceServers = await fetchMeteredServers()
    return {
      rtcConfiguration: { iceServers, iceTransportPolicy: forceRelay ? 'relay' : 'all' },
      turnAvailable: true,
      forceRelay,
    }
  } catch {
    const configured = Boolean(import.meta.env.VITE_METERED_APP?.trim() && import.meta.env.VITE_METERED_CREDENTIAL_API_KEY?.trim())
    return {
      rtcConfiguration: { iceServers: FALLBACK_ICE_SERVERS, iceTransportPolicy: forceRelay ? 'relay' : 'all' },
      turnAvailable: false,
      forceRelay,
      notice: forceRelay
        ? 'Relay test enabled, but Metered TURN is unavailable. The test will fail until Metered is configured and reachable.'
        : configured
          ? 'Metered TURN is unavailable; using public STUN fallback. Some networks may not connect.'
          : 'Metered TURN is not configured; using public STUN fallback. Some networks may not connect.',
    }
  }
}

export function loadIceConfiguration(): Promise<IceConfiguration> {
  cachedConfiguration ??= resolveConfiguration()
  return cachedConfiguration
}
