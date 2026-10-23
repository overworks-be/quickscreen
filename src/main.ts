import Peer, { type DataConnection, type MediaConnection } from 'peerjs'
import './style.css'

const ROOM_DURATION_SECONDS = 30
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const app = document.querySelector<HTMLDivElement>('#app')!

type Room = { code: string; peer: Peer; role: 'host' | 'viewer'; stream?: MediaStream; viewerId?: string; call?: MediaConnection; data?: DataConnection; timer?: number; retryTimer?: number; retries?: number; startedAt?: number }
let room: Room | undefined

function shell(content: string) {
  app.innerHTML = `<main class="page"><header class="brand"><a href="#/" aria-label="QuickScreen accueil"><span class="brand-mark">Q</span><span>QuickScreen</span></a><span class="brand-note">Partage d’écran instantané</span></header>${content}<footer>Une connexion directe entre navigateurs. Aucune vidéo n’est enregistrée.</footer></main>`
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
  shell(`<section class="room"><a class="back-link" href="#/">← Accueil</a><div class="room-heading"><div><div class="eyebrow"><i></i> VOTRE SALON</div><h1>Prêt à partager ?</h1><p class="intro">Envoyez ce lien à la personne qui doit voir votre écran.</p></div><div class="room-code"><span>CODE DU SALON</span><strong>${code}</strong></div></div><div class="share-link"><span>${link}</span><button id="copy" class="icon-button" aria-label="Copier le lien">⧉</button></div><div class="action-row"><button id="share" class="button secondary">Partager le lien <span>↗</span></button><button id="start" class="button primary" ${sharing ? 'disabled' : ''}>${sharing ? 'Partage en cours' : 'Partager mon écran'} <span>◉</span></button></div><div class="status-line"><i class="status-dot ${sharing ? 'active' : ''}"></i><span id="status">${status}</span></div><div class="preview-wrap ${sharing ? '' : 'hidden'}"><video id="preview" autoplay muted playsinline></video><div class="preview-label"><i></i> VOUS PARTAGEZ VOTRE ÉCRAN <b id="timer">00:00</b></div><button class="stop-button" id="stop">Arrêter le partage</button></div><p class="compat">${!navigator.mediaDevices?.getDisplayMedia ? 'La capture d’écran n’est pas disponible dans ce navigateur. Essayez Chrome, Edge, Firefox ou Safari récent sur ordinateur.' : 'Le partage s’arrête automatiquement après 30 secondes.'}</p></section>`)
  document.querySelector('#copy')!.addEventListener('click', () => copyLink(link))
  document.querySelector('#share')!.addEventListener('click', () => shareLink(link))
  document.querySelector('#start')!.addEventListener('click', startScreenShare)
  if (sharing && room?.stream) {
    const video = document.querySelector<HTMLVideoElement>('#preview')!
    video.srcObject = room.stream
    document.querySelector('#stop')!.addEventListener('click', () => stopSharing('Partage terminé.'))
  }
}

function viewerView(code: string, status: string, state: 'waiting' | 'live' | 'ended' | 'error' = 'waiting') {
  shell(`<section class="room viewer-room"><a class="back-link" href="#/">← Accueil</a><div class="viewer-heading"><div class="eyebrow"><i></i> SALON ${code}</div><h1>${state === 'live' ? 'Vous êtes connecté.' : state === 'ended' ? 'Le partage est terminé.' : state === 'error' ? 'Impossible de rejoindre.' : 'Le salon est ouvert.'}</h1><p id="viewer-status" class="intro">${status}</p></div><div class="viewer-screen ${state === 'live' ? 'is-live' : ''}"><video id="remote" autoplay playsinline></video><div id="waiting" class="waiting-state ${state === 'live' ? 'hidden' : ''}"><div class="waiting-icon">${state === 'ended' ? '✓' : state === 'error' ? '!' : '<span></span>'}</div><strong>${state === 'live' ? '' : state === 'ended' ? 'Session terminée' : state === 'error' ? 'Salon indisponible' : 'En attente du partage d’écran…'}</strong><small>${state === 'waiting' ? 'Cette page se mettra à jour dès que le partage commence.' : ''}</small></div><div class="live-label ${state === 'live' ? '' : 'hidden'}"><i></i> EN DIRECT</div></div><a class="button secondary new-room" href="#/">Créer un nouveau salon <span>↗</span></a></section>`)
}

async function copyLink(link: string) {
  try { await navigator.clipboard.writeText(link); const button = document.querySelector<HTMLButtonElement>('#copy'); if (button) button.textContent = '✓'; setTimeout(() => { if (button) button.textContent = '⧉' }, 1600) }
  catch { window.prompt('Copiez ce lien :', link) }
}

async function shareLink(link: string) {
  if (navigator.share) { try { await navigator.share({ title: 'Salon QuickScreen', url: link }) } catch (error) { if ((error as Error).name !== 'AbortError') await copyLink(link) } }
  else await copyLink(link)
}

function newPeer(id?: string) {
  const options = { debug: 0 as const, config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478' }] } }
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
      if (elapsed >= ROOM_DURATION_SECONDS) stopSharing('Partage terminé après 30 secondes.')
    }, 250)
    connectViewerStream()
  } catch (error) {
    if ((error as Error).name !== 'NotAllowedError') hostView(room?.code ?? '', 'La capture d’écran n’a pas pu démarrer. Vérifiez les autorisations du navigateur.')
  }
}

function connectViewerStream() {
  if (!room?.stream || !room.viewerId || room.call) return
  const call = room.peer.call(room.viewerId, room.stream, { metadata: { room: room.code } })
  room.call = call
  call.on('close', () => { if (room) room.call = undefined })
  call.on('error', () => { if (room) room.call = undefined })
}

function stopSharing(status: string) {
  if (!room || room.role !== 'host') return
  if (room.timer) window.clearInterval(room.timer)
  if (room.retryTimer) window.clearTimeout(room.retryTimer)
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
  room.call?.close()
  room.data?.close()
  room.stream?.getTracks().forEach((track) => track.stop())
  room.peer.destroy()
  room = undefined
}

function enterRoom(code: string, host: boolean) {
  cleanup()
  if (host) {
    const peer = newPeer(`quickscreen-${code}`)
    room = { code, peer, role: 'host' }
    hostView(code, 'En attente du spectateur…')
    peer.on('open', () => { if (room?.code === code) document.querySelector('#status')!.textContent = 'En attente du spectateur…' })
    peer.on('connection', (connection) => {
      if (!room || room.code !== code || room.viewerId) { connection.close(); return }
      room.viewerId = connection.peer
      room.data = connection
      connection.on('data', (data) => {
        if ((data as { type?: string }).type === 'watch') { document.querySelector('#status')!.textContent = room?.stream ? 'Spectateur connecté.' : 'Spectateur connecté — prêt à partager.'; connectViewerStream() }
      })
      connection.on('close', () => { if (room?.data === connection) { room.viewerId = undefined; room.data = undefined; room.call?.close(); room.call = undefined; document.querySelector('#status')!.textContent = 'Le spectateur s’est déconnecté.' } })
    })
    peer.on('error', (error) => { if (!room || room.code !== code) return; if (error.type === 'unavailable-id') { peer.destroy(); room = undefined; hostView(code, 'Ce code est déjà utilisé. Revenez à l’accueil et créez un autre salon.') } else if (error.type === 'network' || error.type === 'server-error') document.querySelector('#status')!.textContent = 'Connexion au service de signalisation impossible. Réessayez dans un instant.' })
    return
  }
  viewerView(code, 'Connexion au salon…')
  const peer = newPeer()
  room = { code, peer, role: 'viewer' }
  peer.on('open', () => {
    if (!room || room.code !== code) return
    connectToHost(code, peer)
  })
  peer.on('call', (call) => {
    if (!room || room.code !== code) { call.close(); return }
    room.call?.close()
    room.call = call
    call.answer()
    call.on('stream', (stream) => {
      if (!room || room.code !== code) return
      viewerView(code, 'Le partage d’écran est en direct.', 'live')
      const video = document.querySelector<HTMLVideoElement>('#remote')!
      video.srcObject = stream
      video.play().catch(() => {})
      stream.getTracks().forEach((track) => track.addEventListener('ended', () => { if (room?.role === 'viewer') viewerView(code, 'Le partage est terminé.', 'ended') }))
    })
    call.on('close', () => { if (room?.role === 'viewer' && room.code === code) viewerView(code, 'Le partage est terminé.', 'ended') })
    call.on('error', () => { if (room?.role === 'viewer' && room.code === code) viewerView(code, 'La connexion vidéo a échoué.', 'error') })
  })
  peer.on('error', () => {
    if (!room || room.code !== code) return
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
