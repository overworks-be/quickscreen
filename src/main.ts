import Peer, { type DataConnection, type MediaConnection } from 'peerjs'
import { loadPresenterIceConfiguration, loadVisitorIceConfiguration, testMeteredSettings, type IceConfiguration, type MeteredSettings } from './services/iceServers'
import { readPresenterSettings, resetPresenterSettings, savePresenterSettings } from './services/presenterSettings'
import { getLanguage, localize, setLanguage, type Language } from './i18n'
import './style.css'

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const app = document.querySelector<HTMLDivElement>('#app')!
const i18nObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes') localize(mutation.target as Element)
    else if (mutation.type === 'characterData') {
      const parent = mutation.target.parentElement
      if (parent) localize(parent)
    } else {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) localize(node)
        else if (node.parentElement) localize(node.parentElement)
      })
    }
  }
})
i18nObserver.observe(app, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder', 'title'] })

type Room = { code: string; peer?: Peer; role: 'host' | 'viewer'; ice?: IceConfiguration; settings?: MeteredSettings; rememberSettings?: boolean; settingsFeedback?: string; configuring?: boolean; stream?: MediaStream; viewerId?: string; call?: MediaConnection; data?: DataConnection; timer?: number; retryTimer?: number; diagnosticsTimer?: number; retries?: number; startedAt?: number }
let room: Room | undefined

function shell(content: string) {
  app.innerHTML = `<main class="page"><header class="brand"><a href="#/" aria-label="QuickScreen accueil"><span class="brand-mark">Q</span><span>QuickScreen</span></a><span class="brand-note">Partage d’écran instantané</span><label class="language-picker"><span class="visually-hidden">Language</span><select id="language" aria-label="Language"><option value="en" ${getLanguage() === 'en' ? 'selected' : ''}>EN</option><option value="fr" ${getLanguage() === 'fr' ? 'selected' : ''}>FR</option><option value="nl" ${getLanguage() === 'nl' ? 'selected' : ''}>NL</option></select></label></header>${content}<footer>Une connexion directe entre navigateurs. Aucune vidéo n’est enregistrée.</footer></main>`
  localize(app)
  document.querySelector<HTMLSelectElement>('#language')!.addEventListener('change', (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value as Language
    setLanguage(value)
    localize(app)
  })
}

function iceNoticeMarkup() {
  return room?.ice?.notice ? `<p class="compat">${room.ice.notice}</p>` : ''
}

function diagnosticsMarkup() {
  return import.meta.env.DEV && room?.ice
    ? '<details class="diagnostics"><summary>WebRTC diagnostics</summary><pre id="diagnostics">Waiting for ICE statistics…</pre></details>'
    : ''
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
}

function presenterSettingsMarkup() {
  if (room?.role !== 'host') return ''
  const appName = escapeHtml(room.settings?.appName ?? '')
  const apiKey = escapeHtml(room.settings?.credentialApiKey ?? '')
  const checked = room.rememberSettings ? 'checked' : ''
  const disabled = room.configuring || room.stream ? 'disabled' : ''
  const feedback = room.settingsFeedback ? `<p class="turn-feedback" id="turn-feedback">${escapeHtml(room.settingsFeedback)}</p>` : '<p class="turn-feedback" id="turn-feedback"></p>'
  return `<details class="turn-settings" ${room.settings ? '' : 'open'}><summary>Configuration TURN <span>Présentateur uniquement</span></summary><p>Relais Metered facultatif pour les réseaux qui ne peuvent pas se connecter directement. Le visiteur n’a besoin d’aucun réglage.</p><label for="metered-app">Domaine Metered</label><input id="metered-app" type="text" autocomplete="off" placeholder="your-app-name" value="${appName}" ${disabled}><label for="metered-key">Credential API Key</label><input id="metered-key" type="password" autocomplete="new-password" placeholder="TURN credential API key" value="${apiKey}" ${disabled}><label class="remember-setting"><input id="remember-metered" type="checkbox" ${checked} ${disabled}> Mémoriser sur ce navigateur</label><div class="turn-actions"><button class="button secondary" id="test-metered" ${disabled}>Tester la configuration</button><button class="button primary" id="save-metered" ${disabled}>Enregistrer</button><button class="button secondary" id="reset-metered" ${disabled}>Réinitialiser</button></div>${feedback}<small>La clé est conservée dans le stockage du navigateur. N’utilisez jamais la Secret Key du compte Metered.</small></details>`
}

function home(message = '') {
  cleanup()
  shell(`<section class="hero"><div class="eyebrow"><i></i> SIMPLE, PRIVÉ, EN DIRECT</div><h1>Votre écran,<br><em>en un lien.</em></h1><p class="intro">Partagez votre écran en direct, sans compte ni installation.</p><div class="home-actions"><button class="button primary" id="create">Créer un salon <span>↗</span></button><div class="join-row"><input id="code" maxlength="8" autocomplete="off" placeholder="CODE DU SALON" aria-label="Code du salon"><button class="button secondary" id="join">Rejoindre <span>→</span></button></div></div>${message ? `<p class="notice">${message}</p>` : ''}<p class="fineprint">Votre navigateur vous demandera votre accord avant tout partage.</p></section><div class="home-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="screen-card"><div class="screen-top"><span></span><span></span><span></span><b>ÉCRAN EN DIRECT</b></div><div class="screen-content"><div class="sun"></div><div class="mountain mountain-back"></div><div class="mountain mountain-front"></div><div class="live-tag"><i></i> LIVE</div></div></div><div class="float-chip chip-lock">⌑ <span>Connexion privée</span></div><div class="float-chip chip-live"><i></i> EN DIRECT</div></div>`)
  document.querySelector('#create')!.addEventListener('click', createRoom)
  document.querySelector('#join')!.addEventListener('click', () => {
    const code = (document.querySelector<HTMLInputElement>('#code')!.value || '').trim().toUpperCase()
    if (!/^[A-HJ-NP-Z2-9]{8}$/.test(code)) { document.querySelector<HTMLInputElement>('#code')!.focus(); return }
    location.hash = `/room/${code}`
  })
  document.querySelector<HTMLInputElement>('#code')!.addEventListener('keydown', (event) => { if (event.key === 'Enter') document.querySelector<HTMLButtonElement>('#join')!.click() })
}

function secureCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return [...bytes].map((byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('')
}

function createRoom() {
  const code = secureCode()
  location.hash = `/room/${code}?host=1`
}

function roomUrl(code: string) { return `${location.origin}${location.pathname}#/room/${code}` }

function hostView(code: string, status: string, sharing = false) {
  const link = roomUrl(code)
  const startDisabled = sharing || !room?.peer || room.configuring
  shell(`<section class="room"><a class="back-link" href="#/">← Accueil</a><div class="room-heading"><div><div class="eyebrow"><i></i> VOTRE SALON</div><h1>Prêt à partager ?</h1><p class="intro">Envoyez ce lien à la personne qui doit voir votre écran.</p></div><div class="room-code"><span>CODE DU SALON</span><strong>${code}</strong></div></div><div class="share-link"><span>${link}</span><button id="copy" class="icon-button" aria-label="Copier le lien">⧉</button></div><div class="action-row"><button id="share" class="button secondary">Partager le lien <span>↗</span></button><button id="start" class="button primary" ${startDisabled ? 'disabled' : ''}>${sharing ? 'Partage en cours' : 'Partager mon écran'} <span>◉</span></button></div><div class="status-line"><i class="status-dot ${sharing ? 'active' : ''}"></i><span id="status">${status}</span></div>${iceNoticeMarkup()}${presenterSettingsMarkup()}<div class="preview-wrap ${sharing ? '' : 'hidden'}"><video id="preview" autoplay muted playsinline></video><div class="preview-label"><i></i> VOUS PARTAGEZ VOTRE ÉCRAN <b id="timer">00:00</b></div><button class="stop-button" id="stop">Arrêter le partage</button></div>${sharing ? diagnosticsMarkup() : ''}${!navigator.mediaDevices?.getDisplayMedia ? '<p class="compat">La capture d’écran n’est pas disponible dans ce navigateur. Essayez Chrome, Edge, Firefox ou Safari récent sur ordinateur.</p>' : ''}</section>`)
  document.querySelector('#copy')!.addEventListener('click', () => copyLink(link))
  document.querySelector('#share')!.addEventListener('click', () => shareLink(link))
  document.querySelector('#start')!.addEventListener('click', startScreenShare)
  wirePresenterSettings()
  if (sharing && room?.stream) {
    const video = document.querySelector<HTMLVideoElement>('#preview')!
    video.srcObject = room.stream
    document.querySelector('#stop')!.addEventListener('click', () => stopSharing('Partage terminé.'))
  }
}

function wirePresenterSettings() {
  if (room?.role !== 'host') return
  const testButton = document.querySelector<HTMLButtonElement>('#test-metered')
  const saveButton = document.querySelector<HTMLButtonElement>('#save-metered')
  const resetButton = document.querySelector<HTMLButtonElement>('#reset-metered')
  testButton?.addEventListener('click', async () => {
    const settings = readSettingsForm()
    setSettingsFeedback('Test de la configuration Metered…')
    testButton.disabled = true
    const result = await testMeteredSettings(settings)
    if (result.ok) setSettingsFeedback(`Configuration valide (${result.serverCount} serveurs ICE).`)
    else setSettingsFeedback(result.message)
    if (testButton.isConnected && !room?.configuring && !room?.stream) testButton.disabled = false
  })
  saveButton?.addEventListener('click', async () => {
    const currentRoom = room
    if (!currentRoom || currentRoom.role !== 'host') return
    const settings = readSettingsForm()
    if (!settings.appName || !settings.credentialApiKey) {
      setSettingsFeedback('Indique le domaine Metered et la Credential API Key, ou clique sur Réinitialiser.')
      return
    }
    const remember = document.querySelector<HTMLInputElement>('#remember-metered')?.checked ?? false
    const stored = savePresenterSettings(settings, remember)
    currentRoom.settings = settings
    currentRoom.rememberSettings = remember
    currentRoom.settingsFeedback = stored ? 'Configuration enregistrée. Mise à jour de la connexion…' : 'Stockage navigateur indisponible. La configuration restera en mémoire dans cette page.'
    await initializePresenterPeer(currentRoom, 'Mise à jour de la configuration TURN…')
  })
  resetButton?.addEventListener('click', async () => {
    const currentRoom = room
    if (!currentRoom || currentRoom.role !== 'host') return
    const stored = resetPresenterSettings()
    currentRoom.settings = undefined
    currentRoom.rememberSettings = false
    currentRoom.settingsFeedback = stored ? 'Configuration Metered effacée. STUN seul sera utilisé.' : 'Impossible d’effacer le stockage navigateur.'
    await initializePresenterPeer(currentRoom, 'Retour à la configuration STUN…')
  })
}

function readSettingsForm(): MeteredSettings {
  return {
    appName: document.querySelector<HTMLInputElement>('#metered-app')?.value.trim() ?? '',
    credentialApiKey: document.querySelector<HTMLInputElement>('#metered-key')?.value.trim() ?? '',
  }
}

function setSettingsFeedback(message: string) {
  const feedback = document.querySelector<HTMLElement>('#turn-feedback')
  if (feedback) feedback.textContent = message
}

function viewerView(code: string, status: string, state: 'waiting' | 'live' | 'ended' | 'error' = 'waiting') {
  shell(`<section class="room viewer-room"><a class="back-link" href="#/">← Accueil</a><div class="viewer-heading"><div class="eyebrow"><i></i> SALON ${code}</div><h1>${state === 'live' ? 'Vous êtes connecté.' : state === 'ended' ? 'Le partage est terminé.' : state === 'error' ? 'Impossible de rejoindre.' : 'Le salon est ouvert.'}</h1><p id="viewer-status" class="intro">${status}</p></div>${iceNoticeMarkup()}<div class="viewer-screen ${state === 'live' ? 'is-live' : ''}"><video id="remote" autoplay playsinline></video><div id="waiting" class="waiting-state ${state === 'live' ? 'hidden' : ''}"><div class="waiting-icon">${state === 'ended' ? '✓' : state === 'error' ? '!' : '<span></span>'}</div><strong>${state === 'live' ? '' : state === 'ended' ? 'Session terminée' : state === 'error' ? 'Salon indisponible' : 'En attente du partage d’écran…'}</strong><small>${state === 'waiting' ? 'Cette page se mettra à jour dès que le partage commence.' : ''}</small></div><div class="live-label ${state === 'live' ? '' : 'hidden'}"><i></i> EN DIRECT</div></div>${state === 'live' ? diagnosticsMarkup() : ''}${state === 'error' ? '<button id="retry" class="button secondary new-room">Réessayer <span>↻</span></button>' : '<a class="button secondary new-room" href="#/">Créer un nouveau salon <span>↗</span></a>'}</section>`)
  document.querySelector('#retry')?.addEventListener('click', () => enterRoom(code, false))
}

async function copyLink(link: string) {
  try { await navigator.clipboard.writeText(link); const button = document.querySelector<HTMLButtonElement>('#copy'); if (button) button.textContent = '✓'; setTimeout(() => { if (button) button.textContent = '⧉' }, 1600) }
  catch { window.prompt('Copiez ce lien :', link) }
}

async function shareLink(link: string) {
  if (navigator.share) { try { await navigator.share({ title: 'Salon QuickScreen', url: link }) } catch (error) { if ((error as Error).name !== 'AbortError') await copyLink(link) } }
  else await copyLink(link)
}

function newPeer(id: string | undefined, config: RTCConfiguration) {
  const options = { debug: 0 as const, config }
  return id ? new Peer(id, options) : new Peer(options)
}

async function startScreenShare() {
  if (!navigator.mediaDevices?.getDisplayMedia) { hostView(room!.code, 'La capture d’écran n’est pas disponible dans ce navigateur.'); return }
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
    if (!room || room.role !== 'host') { stream.getTracks().forEach((track) => track.stop()); return }
    room.stream = stream
    stream.getVideoTracks()[0]?.addEventListener('ended', () => stopSharing('Partage arrêté depuis le navigateur.'))
    room.startedAt = Date.now()
    hostView(room.code, 'Votre écran est partagé en direct.', true)
    room.timer = window.setInterval(() => {
      const elapsed = Math.max(0, Math.floor((Date.now() - (room?.startedAt ?? Date.now())) / 1000))
      const timer = document.querySelector('#timer')
      if (timer) timer.textContent = `00:${String(elapsed).padStart(2, '0')}`
    }, 250)
    connectViewerStream()
  } catch (error) {
    if ((error as Error).name !== 'NotAllowedError') hostView(room?.code ?? '', 'La capture d’écran n’a pas pu démarrer. Vérifiez les autorisations du navigateur.')
  }
}

function connectViewerStream() {
  if (!room?.peer || !room.stream || !room.viewerId || room.call) return
  const call = room.peer.call(room.viewerId, room.stream, { metadata: { room: room.code } })
  room.call = call
  monitorIceFailure(call, () => {
    const status = document.querySelector('#status')
    if (status) status.textContent = 'Impossible d’établir la connexion WebRTC. Vérifie le relais TURN ou demande au visiteur de réessayer.'
  })
  startCallDiagnostics(call)
  call.on('close', () => { if (room) { room.call = undefined; clearDiagnostics() } })
  call.on('error', () => {
    if (room) {
      room.call = undefined
      clearDiagnostics()
      const status = document.querySelector('#status')
      if (status) status.textContent = 'Video connection failed. Ask the viewer to retry or check TURN connectivity.'
    }
  })
}

function stopSharing(status: string) {
  if (!room || room.role !== 'host') return
  if (room.timer) window.clearInterval(room.timer)
  if (room.retryTimer) window.clearTimeout(room.retryTimer)
  clearDiagnostics()
  room.timer = undefined
  room.call?.close()
  room.call = undefined
  room.stream?.getTracks().forEach((track) => track.stop())
  room.stream = undefined
  room.data?.send({ type: 'ended' })
  hostView(room.code, status)
}

function cleanup() {
  if (!room) return
  if (room.timer) window.clearInterval(room.timer)
  if (room.retryTimer) window.clearTimeout(room.retryTimer)
  clearDiagnostics()
  room.call?.close()
  room.data?.close()
  room.stream?.getTracks().forEach((track) => track.stop())
  room.peer?.destroy()
  room = undefined
}

function enterRoom(code: string, host: boolean) {
  cleanup()
  const savedSettings = host ? readPresenterSettings() : undefined
  const currentRoom: Room = {
    code,
    role: host ? 'host' : 'viewer',
    settings: savedSettings?.settings,
    rememberSettings: savedSettings?.remember,
    configuring: host,
  }
  room = currentRoom
  if (host) hostView(code, 'Préparation de la connexion sécurisée…')
  else {
    viewerView(code, 'Connexion au salon…')
    const ice = loadVisitorIceConfiguration()
    currentRoom.ice = ice
    currentRoom.peer = newPeer(undefined, ice.rtcConfiguration)
    startViewerPeer(currentRoom)
  }
  if (host) void initializePresenterPeer(currentRoom, 'Préparation de la connexion sécurisée…')
}

async function initializePresenterPeer(currentRoom: Room, status: string) {
  if (room !== currentRoom || currentRoom.role !== 'host') return
  currentRoom.configuring = true
  hostView(currentRoom.code, status)
  const forceRelay = import.meta.env.VITE_WEBRTC_FORCE_RELAY?.trim().toLowerCase() === 'true'
  const ice = await loadPresenterIceConfiguration(currentRoom.settings, forceRelay)
  if (room !== currentRoom) return

  const previousCall = currentRoom.call
  const previousData = currentRoom.data
  const previousPeer = currentRoom.peer
  currentRoom.call = undefined
  currentRoom.data = undefined
  currentRoom.peer = undefined
  currentRoom.viewerId = undefined
  previousCall?.close()
  previousData?.close()
  previousPeer?.destroy()
  clearDiagnostics()

  currentRoom.ice = ice
  currentRoom.configuring = false
  await new Promise((resolve) => window.setTimeout(resolve, 250))
  if (room !== currentRoom) return
  currentRoom.peer = newPeer(`quickscreen-${currentRoom.code}`, ice.rtcConfiguration)
  startHostPeer(currentRoom)
}

function startHostPeer(currentRoom: Room) {
  const { code, peer } = currentRoom
  if (!peer) return
  hostView(code, 'En attente du spectateur…')
  peer.on('open', () => { if (room === currentRoom) { const status = document.querySelector('#status'); if (status) status.textContent = 'En attente du spectateur…' } })
  peer.on('connection', (connection) => {
    if (room !== currentRoom || currentRoom.viewerId) { connection.close(); return }
    currentRoom.viewerId = connection.peer
    currentRoom.data = connection
    connection.on('data', (data) => {
      if ((data as { type?: string }).type === 'watch') {
        const status = document.querySelector('#status')
        if (status) status.textContent = currentRoom.stream ? 'Spectateur connecté.' : 'Spectateur connecté — prêt à partager.'
        connectViewerStream()
      }
    })
    connection.on('close', () => {
      if (room === currentRoom && currentRoom.data === connection) {
        currentRoom.viewerId = undefined
        currentRoom.data = undefined
        currentRoom.call?.close()
        currentRoom.call = undefined
        clearDiagnostics()
        const status = document.querySelector('#status')
        if (status) status.textContent = 'Le spectateur s’est déconnecté.'
      }
    })
  })
  peer.on('error', (error) => {
    if (room !== currentRoom) return
    if (error.type === 'unavailable-id') {
      peer.destroy()
      room = undefined
      hostView(code, 'Ce code est déjà utilisé. Revenez à l’accueil et créez un autre salon.')
    } else if (error.type === 'network' || error.type === 'server-error') {
      const status = document.querySelector('#status')
      if (status) status.textContent = 'Connexion au service de signalisation impossible. Vérifiez votre réseau.'
    }
  })
}

function startViewerPeer(currentRoom: Room) {
  const { code, peer } = currentRoom
  if (!peer) return
  viewerView(code, 'Connexion au salon…')
  peer.on('open', () => {
    if (room !== currentRoom) return
    connectToHost(code, peer)
  })
  peer.on('call', (call) => {
    if (room !== currentRoom) { call.close(); return }
    currentRoom.call?.close()
    currentRoom.call = call
    call.answer()
    monitorIceFailure(call, () => {
      if (room === currentRoom) viewerView(code, 'Impossible d’établir la connexion. Votre réseau ou celui de votre interlocuteur empêche peut-être le partage.', 'error')
    })
    startCallDiagnostics(call)
    call.on('stream', (stream) => {
      if (room !== currentRoom) return
      viewerView(code, 'Le partage d’écran est en direct.', 'live')
      startCallDiagnostics(call)
      const video = document.querySelector<HTMLVideoElement>('#remote')!
      video.srcObject = stream
      video.play().catch(() => {})
      stream.getTracks().forEach((track) => track.addEventListener('ended', () => { if (room === currentRoom) { clearDiagnostics(); viewerView(code, 'Le partage est terminé.', 'ended') } }))
    })
    call.on('close', () => {
      if (room !== currentRoom) return
      clearDiagnostics()
      const failed = call.peerConnection?.iceConnectionState === 'failed'
      if (failed) viewerView(code, 'Impossible d’établir la connexion. Votre réseau ou celui de votre interlocuteur empêche peut-être le partage.', 'error')
      else viewerView(code, 'Le partage est terminé.', 'ended')
    })
    call.on('error', () => { if (room === currentRoom) { clearDiagnostics(); viewerView(code, 'La connexion vidéo a échoué. Vérifiez le réseau et réessayez.', 'error') } })
  })
  peer.on('error', () => {
    if (room !== currentRoom) return
    viewerView(code, 'Connexion au service de signalisation impossible. Vérifiez votre réseau.', 'error')
  })
}

function connectToHost(code: string, peer: Peer) {
  if (!room || room.code !== code || room.role !== 'viewer') return
  const connection = peer.connect(`quickscreen-${code}`, { reliable: true })
  room.data = connection
  connection.on('open', () => {
    if (!room || room.code !== code) return
    if (room.retryTimer) window.clearTimeout(room.retryTimer)
    room.retryTimer = undefined
    room.retries = 0
    connection.send({ type: 'watch' })
    const status = document.querySelector('#viewer-status')
    if (status) status.textContent = 'Connecté. En attente du partage d’écran…'
  })
  connection.on('data', (data) => { if ((data as { type?: string }).type === 'ended') { room?.call?.close(); viewerView(code, 'Le partage a été arrêté par le diffuseur.', 'ended') } })
  connection.on('error', () => retryHostConnection(code, peer))
  connection.on('close', () => retryHostConnection(code, peer))
}

function clearDiagnostics() {
  if (room?.diagnosticsTimer) window.clearInterval(room.diagnosticsTimer)
  if (room) room.diagnosticsTimer = undefined
}

function monitorIceFailure(call: MediaConnection, onFailure: () => void) {
  const peerConnection = call.peerConnection
  if (!peerConnection) return
  peerConnection.addEventListener('iceconnectionstatechange', () => {
    if (peerConnection.iceConnectionState === 'failed') onFailure()
  })
}

function startCallDiagnostics(call: MediaConnection) {
  if (!import.meta.env.DEV || !room?.ice) return
  clearDiagnostics()
  void updateCallDiagnostics(call)
  room.diagnosticsTimer = window.setInterval(() => {
    if (room?.call === call) void updateCallDiagnostics(call)
  }, 1500)
}

async function updateCallDiagnostics(call: MediaConnection) {
  const output = document.querySelector<HTMLPreElement>('#diagnostics')
  if (!output) return
  const peerConnection = call.peerConnection
  if (!peerConnection) { output.textContent = 'WebRTC connection is not available yet.'; return }

  let candidatePath = 'No selected candidate pair yet'
  try {
    const stats = await peerConnection.getStats()
    let selectedPair: RTCStats | undefined
    stats.forEach((report) => {
      if (report.type === 'transport' && 'selectedCandidatePairId' in report && report.selectedCandidatePairId) {
        selectedPair = stats.get(report.selectedCandidatePairId)
      }
    })
    if (!selectedPair) {
      stats.forEach((report) => {
        if (report.type === 'candidate-pair' && 'nominated' in report && report.nominated && report.state === 'succeeded') selectedPair = report
      })
    }
    if (selectedPair) {
      const pair = selectedPair as RTCIceCandidatePairStats
      const local = typeof pair.localCandidateId === 'string' ? stats.get(pair.localCandidateId) as RTCStats & { candidateType?: string } : undefined
      const remote = typeof pair.remoteCandidateId === 'string' ? stats.get(pair.remoteCandidateId) as RTCStats & { candidateType?: string } : undefined
      const localType = local?.candidateType ?? 'unknown'
      const remoteType = remote?.candidateType ?? 'unknown'
      const route = localType === 'relay' || remoteType === 'relay' ? 'TURN relay' : 'Direct P2P'
      candidatePath = `${route} (${localType} ↔ ${remoteType})`
    }
  } catch {
    candidatePath = 'ICE statistics are not available in this browser'
  }

  const policy = room?.ice?.forceRelay ? 'relay only' : 'all (direct preferred)'
  output.textContent = `PeerConnection: ${peerConnection.connectionState}\nICE: ${peerConnection.iceConnectionState}\nPath: ${candidatePath}\nICE policy: ${policy}`
}

function retryHostConnection(code: string, peer: Peer) {
  if (!room || room.code !== code || room.role !== 'viewer' || room.retryTimer) return
  if ((room.retries ?? 0) >= 15) { viewerView(code, 'Ce salon n’existe pas ou a expiré.', 'error'); return }
  room.retries = (room.retries ?? 0) + 1
  const status = document.querySelector('#viewer-status')
  if (status) status.textContent = 'Recherche du salon…'
  room.retryTimer = window.setTimeout(() => {
    if (!room || room.code !== code) return
    room.retryTimer = undefined
    room.data?.close()
    connectToHost(code, peer)
  }, 1000)
}

function route() {
  const match = location.hash.match(/^#\/room\/([A-HJ-NP-Z2-9]{8})(?:\?host=1)?$/)
  if (!match) { home(); return }
  const code = match[1]
  enterRoom(code, location.hash.endsWith('?host=1'))
}

window.addEventListener('hashchange', route)
window.addEventListener('beforeunload', cleanup)
route()
