export type Language = 'en' | 'fr' | 'nl'

const translations: Record<string, Record<Language, string>> = {
  'QuickScreen accueil': { en: 'QuickScreen home', fr: 'Accueil QuickScreen', nl: 'QuickScreen startpagina' },
  'Partage d’écran instantané': { en: 'Instant screen sharing', fr: 'Partage d’écran instantané', nl: 'Direct scherm delen' },
  'Une connexion directe entre navigateurs. Aucune vidéo n’est enregistrée.': { en: 'A direct connection between browsers. No video is recorded.', fr: 'Une connexion directe entre navigateurs. Aucune vidéo n’est enregistrée.', nl: 'Een rechtstreekse verbinding tussen browsers. Er wordt geen video opgenomen.' },
  'WebRTC diagnostics': { en: 'WebRTC diagnostics', fr: 'Diagnostics WebRTC', nl: 'WebRTC-diagnose' },
  'Waiting for ICE statistics…': { en: 'Waiting for ICE statistics…', fr: 'En attente des statistiques ICE…', nl: 'Wachten op ICE-statistieken…' },
  'Présentateur uniquement': { en: 'Presenter only', fr: 'Présentateur uniquement', nl: 'Alleen presentator' },
  'Configuration TURN': { en: 'TURN settings', fr: 'Configuration TURN', nl: 'TURN-instellingen' },
  'Relais Metered facultatif pour les réseaux qui ne peuvent pas se connecter directement. Le visiteur n’a besoin d’aucun réglage.': { en: 'Optional Metered relay for networks that cannot connect directly. Viewers do not need to configure anything.', fr: 'Relais Metered facultatif pour les réseaux qui ne peuvent pas se connecter directement. Le visiteur n’a besoin d’aucun réglage.', nl: 'Optionele Metered-relay voor netwerken die geen rechtstreekse verbinding kunnen maken. Bezoekers hoeven niets in te stellen.' },
  'Domaine Metered': { en: 'Metered app name', fr: 'Domaine Metered', nl: 'Metered-appnaam' },
  'Mémoriser sur ce navigateur': { en: 'Remember on this browser', fr: 'Mémoriser sur ce navigateur', nl: 'Onthouden in deze browser' },
  'Tester la configuration': { en: 'Test settings', fr: 'Tester la configuration', nl: 'Instellingen testen' },
  'Enregistrer': { en: 'Save', fr: 'Enregistrer', nl: 'Opslaan' },
  'Réinitialiser': { en: 'Reset', fr: 'Réinitialiser', nl: 'Wissen' },
  'La clé est conservée dans le stockage du navigateur. N’utilisez jamais la Secret Key du compte Metered.': { en: 'The key is stored in this browser. Never use your Metered account Secret Key.', fr: 'La clé est conservée dans le stockage du navigateur. N’utilisez jamais la Secret Key du compte Metered.', nl: 'De sleutel wordt in deze browser opgeslagen. Gebruik nooit de Secret Key van je Metered-account.' },
  'SIMPLE, PRIVÉ, EN DIRECT': { en: 'SIMPLE, PRIVATE, LIVE', fr: 'SIMPLE, PRIVÉ, EN DIRECT', nl: 'EENVOUDIG, PRIVÉ, LIVE' },
  'Votre écran,': { en: 'Your screen,', fr: 'Votre écran,', nl: 'Jouw scherm,' },
  'en un lien.': { en: 'one link away.', fr: 'en un lien.', nl: 'met één link.' },
  'Partagez votre écran en direct, sans compte ni installation.': { en: 'Share your screen live, with no account or installation.', fr: 'Partagez votre écran en direct, sans compte ni installation.', nl: 'Deel je scherm live, zonder account of installatie.' },
  'Créer un salon': { en: 'Create a room', fr: 'Créer un salon', nl: 'Ruimte maken' },
  'CODE DU SALON': { en: 'ROOM CODE', fr: 'CODE DU SALON', nl: 'RUIMTECODE' },
  'Code du salon': { en: 'Room code', fr: 'Code du salon', nl: 'Ruimtecode' },
  'Rejoindre': { en: 'Join', fr: 'Rejoindre', nl: 'Deelnemen' },
  'Votre navigateur vous demandera votre accord avant tout partage.': { en: 'Your browser will ask for permission before sharing.', fr: 'Votre navigateur vous demandera votre accord avant tout partage.', nl: 'Je browser vraagt toestemming voordat je gaat delen.' },
  'ÉCRAN EN DIRECT': { en: 'LIVE SCREEN', fr: 'ÉCRAN EN DIRECT', nl: 'LIVE SCHERM' },
  'Connexion privée': { en: 'Private connection', fr: 'Connexion privée', nl: 'Privéverbinding' },
  'Accueil': { en: 'Home', fr: 'Accueil', nl: 'Start' },
  'VOTRE SALON': { en: 'YOUR ROOM', fr: 'VOTRE SALON', nl: 'JOUW RUIMTE' },
  'Prêt à partager ?': { en: 'Ready to share?', fr: 'Prêt à partager ?', nl: 'Klaar om te delen?' },
  'Envoyez ce lien à la personne qui doit voir votre écran.': { en: 'Send this link to the person who should see your screen.', fr: 'Envoyez ce lien à la personne qui doit voir votre écran.', nl: 'Stuur deze link naar degene die je scherm moet zien.' },
  'Copier le lien': { en: 'Copy link', fr: 'Copier le lien', nl: 'Link kopiëren' },
  'Partager le lien': { en: 'Share link', fr: 'Partager le lien', nl: 'Link delen' },
  'Partage en cours': { en: 'Sharing', fr: 'Partage en cours', nl: 'Bezig met delen' },
  'Partager mon écran': { en: 'Share my screen', fr: 'Partager mon écran', nl: 'Mijn scherm delen' },
  'VOUS PARTAGEZ VOTRE ÉCRAN': { en: 'YOU ARE SHARING YOUR SCREEN', fr: 'VOUS PARTAGEZ VOTRE ÉCRAN', nl: 'JE DEELT JE SCHERM' },
  'Arrêter le partage': { en: 'Stop sharing', fr: 'Arrêter le partage', nl: 'Delen stoppen' },
  'La capture d’écran n’est pas disponible dans ce navigateur. Essayez Chrome, Edge, Firefox ou Safari récent sur ordinateur.': { en: 'Screen capture is not available in this browser. Try a recent desktop version of Chrome, Edge, Firefox, or Safari.', fr: 'La capture d’écran n’est pas disponible dans ce navigateur. Essayez Chrome, Edge, Firefox ou Safari récent sur ordinateur.', nl: 'Schermopname is niet beschikbaar in deze browser. Probeer een recente desktopversie van Chrome, Edge, Firefox of Safari.' },
  'Test de la configuration Metered…': { en: 'Testing Metered settings…', fr: 'Test de la configuration Metered…', nl: 'Metered-instellingen testen…' },
  'Indique le domaine Metered et la Credential API Key, ou clique sur Réinitialiser.': { en: 'Enter the Metered app name and Credential API Key, or select Reset.', fr: 'Indique le domaine Metered et la Credential API Key, ou clique sur Réinitialiser.', nl: 'Vul de Metered-appnaam en Credential API Key in, of kies Wissen.' },
  'Configuration enregistrée. Mise à jour de la connexion…': { en: 'Settings saved. Updating connection…', fr: 'Configuration enregistrée. Mise à jour de la connexion…', nl: 'Instellingen opgeslagen. Verbinding wordt bijgewerkt…' },
  'Stockage navigateur indisponible. La configuration restera en mémoire dans cette page.': { en: 'Browser storage is unavailable. Settings will remain in memory for this page.', fr: 'Stockage navigateur indisponible. La configuration restera en mémoire dans cette page.', nl: 'Browseropslag is niet beschikbaar. De instellingen blijven alleen op deze pagina bewaard.' },
  'Configuration Metered effacée. STUN seul sera utilisé.': { en: 'Metered settings cleared. STUN only will be used.', fr: 'Configuration Metered effacée. STUN seul sera utilisé.', nl: 'Metered-instellingen gewist. Alleen STUN wordt gebruikt.' },
  'Impossible d’effacer le stockage navigateur.': { en: 'Could not clear browser storage.', fr: 'Impossible d’effacer le stockage navigateur.', nl: 'Browseropslag kon niet worden gewist.' },
  'Retour à la configuration STUN…': { en: 'Switching back to STUN…', fr: 'Retour à la configuration STUN…', nl: 'Terugschakelen naar STUN…' },
  'Salon': { en: 'Room', fr: 'Salon', nl: 'Ruimte' },
  'Vous êtes connecté.': { en: 'You are connected.', fr: 'Vous êtes connecté.', nl: 'Je bent verbonden.' },
  'Le partage est terminé.': { en: 'Screen sharing has ended.', fr: 'Le partage est terminé.', nl: 'Het scherm delen is beëindigd.' },
  'Impossible de rejoindre.': { en: 'Could not join.', fr: 'Impossible de rejoindre.', nl: 'Deelnemen is mislukt.' },
  'Le salon est ouvert.': { en: 'The room is open.', fr: 'Le salon est ouvert.', nl: 'De ruimte is geopend.' },
  'Session terminée': { en: 'Session ended', fr: 'Session terminée', nl: 'Sessie beëindigd' },
  'Salon indisponible': { en: 'Room unavailable', fr: 'Salon indisponible', nl: 'Ruimte niet beschikbaar' },
  'En attente du partage d’écran…': { en: 'Waiting for screen sharing…', fr: 'En attente du partage d’écran…', nl: 'Wachten tot het scherm wordt gedeeld…' },
  'Cette page se mettra à jour dès que le partage commence.': { en: 'This page will update as soon as sharing starts.', fr: 'Cette page se mettra à jour dès que le partage commence.', nl: 'Deze pagina wordt bijgewerkt zodra het delen begint.' },
  'EN DIRECT': { en: 'LIVE', fr: 'EN DIRECT', nl: 'LIVE' },
  'Réessayer': { en: 'Try again', fr: 'Réessayer', nl: 'Opnieuw proberen' },
  'Créer un nouveau salon': { en: 'Create a new room', fr: 'Créer un nouveau salon', nl: 'Nieuwe ruimte maken' },
  'Copiez ce lien :': { en: 'Copy this link:', fr: 'Copiez ce lien :', nl: 'Kopieer deze link:' },
  'Salon QuickScreen': { en: 'QuickScreen room', fr: 'Salon QuickScreen', nl: 'QuickScreen-ruimte' },
  'La capture d’écran n’a pas pu démarrer. Vérifiez les autorisations du navigateur.': { en: 'Screen sharing could not start. Check your browser permissions.', fr: 'La capture d’écran n’a pas pu démarrer. Vérifiez les autorisations du navigateur.', nl: 'Scherm delen kon niet starten. Controleer de browsermachtigingen.' },
  'Partage terminé.': { en: 'Sharing ended.', fr: 'Partage terminé.', nl: 'Delen beëindigd.' },
  'Partage arrêté depuis le navigateur.': { en: 'Sharing stopped in the browser.', fr: 'Partage arrêté depuis le navigateur.', nl: 'Delen gestopt vanuit de browser.' },
  'Impossible d’établir la connexion WebRTC. Vérifie le relais TURN ou demande au visiteur de réessayer.': { en: 'Could not establish a WebRTC connection. Check the TURN relay or ask the viewer to try again.', fr: 'Impossible d’établir la connexion WebRTC. Vérifie le relais TURN ou demande au visiteur de réessayer.', nl: 'WebRTC-verbinding kon niet worden gemaakt. Controleer de TURN-relay of vraag de bezoeker opnieuw te proberen.' },
  'Video connection failed. Ask the viewer to retry or check TURN connectivity.': { en: 'Video connection failed. Ask the viewer to retry or check TURN connectivity.', fr: 'La connexion vidéo a échoué. Demande au visiteur de réessayer ou vérifie TURN.', nl: 'Videoverbinding mislukt. Vraag de bezoeker opnieuw te proberen of controleer TURN.' },
  'Préparation de la connexion sécurisée…': { en: 'Preparing secure connection…', fr: 'Préparation de la connexion sécurisée…', nl: 'Beveiligde verbinding voorbereiden…' },
  'Mise à jour de la configuration TURN…': { en: 'Updating TURN settings…', fr: 'Mise à jour de la configuration TURN…', nl: 'TURN-instellingen bijwerken…' },
  'En attente du spectateur…': { en: 'Waiting for the viewer…', fr: 'En attente du spectateur…', nl: 'Wachten op de bezoeker…' },
  'Spectateur connecté.': { en: 'Viewer connected.', fr: 'Spectateur connecté.', nl: 'Bezoeker verbonden.' },
  'Spectateur connecté — prêt à partager.': { en: 'Viewer connected — ready to share.', fr: 'Spectateur connecté — prêt à partager.', nl: 'Bezoeker verbonden — klaar om te delen.' },
  'Le spectateur s’est déconnecté.': { en: 'The viewer disconnected.', fr: 'Le spectateur s’est déconnecté.', nl: 'De bezoeker heeft de verbinding verbroken.' },
  'Ce code est déjà utilisé. Revenez à l’accueil et créez un autre salon.': { en: 'This code is already in use. Return home and create another room.', fr: 'Ce code est déjà utilisé. Revenez à l’accueil et créez un autre salon.', nl: 'Deze code is al in gebruik. Ga terug en maak een andere ruimte.' },
  'Connexion au service de signalisation impossible. Vérifiez votre réseau.': { en: 'Could not connect to the signaling service. Check your network.', fr: 'Connexion au service de signalisation impossible. Vérifiez votre réseau.', nl: 'Kan geen verbinding maken met de signaleringsdienst. Controleer je netwerk.' },
  'Connexion au salon…': { en: 'Connecting to the room…', fr: 'Connexion au salon…', nl: 'Verbinden met de ruimte…' },
  'Impossible d’établir la connexion. Votre réseau ou celui de votre interlocuteur empêche peut-être le partage.': { en: 'Could not establish a connection. Your network or the other person’s network may be blocking screen sharing.', fr: 'Impossible d’établir la connexion. Votre réseau ou celui de votre interlocuteur empêche peut-être le partage.', nl: 'Verbinding kon niet worden gemaakt. Jouw netwerk of dat van de andere persoon blokkeert mogelijk het scherm delen.' },
  'Le partage d’écran est en direct.': { en: 'Screen sharing is live.', fr: 'Le partage d’écran est en direct.', nl: 'Het scherm wordt live gedeeld.' },
  'Le partage a été arrêté par le diffuseur.': { en: 'The presenter stopped sharing.', fr: 'Le partage a été arrêté par le diffuseur.', nl: 'De presentator is gestopt met delen.' },
  'Le partage a été arrêté par le présentateur.': { en: 'The presenter stopped sharing.', fr: 'Le partage a été arrêté par le présentateur.', nl: 'De presentator is gestopt met delen.' },
  'Connecté. En attente du partage d’écran…': { en: 'Connected. Waiting for screen sharing…', fr: 'Connecté. En attente du partage d’écran…', nl: 'Verbonden. Wachten tot het scherm wordt gedeeld…' },
  'Recherche du salon…': { en: 'Looking for the room…', fr: 'Recherche du salon…', nl: 'Ruimte zoeken…' },
  'Ce salon n’existe pas ou a expiré.': { en: 'This room does not exist or has expired.', fr: 'Ce salon n’existe pas ou a expiré.', nl: 'Deze ruimte bestaat niet of is verlopen.' },
  'Le domaine de l’application Metered est invalide.': { en: 'Invalid Metered app name.', fr: 'Le domaine de l’application Metered est invalide.', nl: 'Ongeldige Metered-appnaam.' },
  'Indique la Credential API Key TURN.': { en: 'Enter the TURN Credential API Key.', fr: 'Indique la Credential API Key TURN.', nl: 'Voer de TURN Credential API Key in.' },
  'Metered a renvoyé une liste de serveurs ICE invalide.': { en: 'Metered returned an invalid ICE server list.', fr: 'Metered a renvoyé une liste de serveurs ICE invalide.', nl: 'Metered heeft een ongeldige lijst met ICE-servers geretourneerd.' },
  'Metered a renvoyé une entrée de serveur ICE invalide.': { en: 'Metered returned an invalid ICE server entry.', fr: 'Metered a renvoyé une entrée de serveur ICE invalide.', nl: 'Metered heeft een ongeldige ICE-serververmelding geretourneerd.' },
  'Metered a renvoyé une URL de serveur ICE invalide.': { en: 'Metered returned an invalid ICE server URL.', fr: 'Metered a renvoyé une URL de serveur ICE invalide.', nl: 'Metered heeft een ongeldige ICE-server-URL geretourneerd.' },
  'Les identifiants du relais TURN Metered sont absents.': { en: 'Metered TURN relay credentials are missing.', fr: 'Les identifiants du relais TURN Metered sont absents.', nl: 'De inloggegevens voor de Metered TURN-relay ontbreken.' },
  'Metered n’a renvoyé aucun serveur TURN.': { en: 'Metered returned no TURN servers.', fr: 'Metered n’a renvoyé aucun serveur TURN.', nl: 'Metered heeft geen TURN-servers geretourneerd.' },
  'La Credential API Key Metered a été refusée.': { en: 'The Metered Credential API Key was rejected.', fr: 'La Credential API Key Metered a été refusée.', nl: 'De Metered Credential API Key is geweigerd.' },
  'La requête Metered a échoué (HTTP ': { en: 'Metered request failed (HTTP ', fr: 'La requête Metered a échoué (HTTP ', nl: 'Metered-aanvraag mislukt (HTTP ' },
  'La requête Metered a dépassé le délai autorisé.': { en: 'The Metered request timed out.', fr: 'La requête Metered a dépassé le délai autorisé.', nl: 'De Metered-aanvraag duurde te lang.' },
  'Impossible de joindre Metered. Vérifie le domaine, le réseau et la connexion au service.': { en: 'Could not reach Metered. Check the app name, network, and service connection.', fr: 'Impossible de joindre Metered. Vérifie le domaine, le réseau et la connexion au service.', nl: 'Kan Metered niet bereiken. Controleer de appnaam, het netwerk en de verbinding met de dienst.' },
  'Impossible de joindre Metered.': { en: 'Could not reach Metered.', fr: 'Impossible de joindre Metered.', nl: 'Kan Metered niet bereiken.' },
  'Le relais Metered TURN n’est pas configuré.': { en: 'Metered TURN relay is not configured.', fr: 'Le relais Metered TURN n’est pas configuré.', nl: 'Metered TURN-relay is niet ingesteld.' },
  'Mode diagnostic relais uniquement activé, mais Metered TURN est indisponible. La connexion échouera tant que le relais n’est pas configuré.': { en: 'Relay-only diagnostic mode is enabled, but Metered TURN is unavailable. The connection will fail until the relay is configured.', fr: 'Mode diagnostic relais uniquement activé, mais Metered TURN est indisponible. La connexion échouera tant que le relais n’est pas configuré.', nl: 'Diagnosemodus met alleen relay is ingeschakeld, maar Metered TURN is niet beschikbaar. De verbinding mislukt totdat de relay is ingesteld.' },
  'Relais TURN indisponible. La connexion directe reste possible selon votre réseau.': { en: 'TURN relay unavailable. A direct connection may still work on your network.', fr: 'Relais TURN indisponible. La connexion directe reste possible selon votre réseau.', nl: 'TURN-relay niet beschikbaar. Een rechtstreekse verbinding kan op jouw netwerk nog werken.' },
  'QuickScreen — Un service expérimental gratuit proposé par Overworks': { en: 'QuickScreen — A free experimental service by Overworks', fr: 'QuickScreen — Un service expérimental gratuit proposé par Overworks', nl: 'QuickScreen — Een gratis experimentele dienst van Overworks' },
  'Interface hébergée sur GitHub Pages · Service fourni en l’état, sans garantie de disponibilité': { en: 'Interface hosted on GitHub Pages · Service provided as is, with no availability guarantee', fr: 'Interface hébergée sur GitHub Pages · Service fourni en l’état, sans garantie de disponibilité', nl: 'Interface gehost op GitHub Pages · Dienst geleverd zoals hij is, zonder beschikbaarheidsgarantie' },
  'Informations': { en: 'Information', fr: 'Informations', nl: 'Informatie' },
  'À propos': { en: 'About', fr: 'À propos', nl: 'Over' },
  'Découvrir Overworks': { en: 'Discover Overworks', fr: 'Découvrir Overworks', nl: 'Ontdek Overworks' },
  'Fermer': { en: 'Close', fr: 'Fermer', nl: 'Sluiten' },
  'QuickScreen — Une expérimentation Overworks': { en: 'QuickScreen — An Overworks experiment', fr: 'QuickScreen — Une expérimentation Overworks', nl: 'QuickScreen — Een experiment van Overworks' },
  'QuickScreen est un outil gratuit de démonstration technologique (Proof of Concept), développé par Overworks.': { en: 'QuickScreen is a free technology demonstration (Proof of Concept) developed by Overworks.', fr: 'QuickScreen est un outil gratuit de démonstration technologique (Proof of Concept), développé par Overworks.', nl: 'QuickScreen is een gratis technologische demonstratie (Proof of Concept), ontwikkeld door Overworks.' },
  'Son interface est hébergée via GitHub Pages. Les communications WebRTC peuvent utiliser des services tiers de signalisation ou de relais TURN.': { en: 'Its interface is hosted on GitHub Pages. WebRTC communications may use third-party signaling or TURN relay services.', fr: 'Son interface est hébergée via GitHub Pages. Les communications WebRTC peuvent utiliser des services tiers de signalisation ou de relais TURN.', nl: 'De interface wordt gehost via GitHub Pages. WebRTC-communicatie kan gebruikmaken van signalerings- of TURN-relaydiensten van derden.' },
  'Ce service est fourni en l’état, sans garantie de disponibilité, de continuité ou de bon fonctionnement et sans support garanti.': { en: 'This service is provided as is, without guarantees of availability, continuity, or proper operation, and with no guaranteed support.', fr: 'Ce service est fourni en l’état, sans garantie de disponibilité, de continuité ou de bon fonctionnement et sans support garanti.', nl: 'Deze dienst wordt geleverd zoals hij is, zonder garantie op beschikbaarheid, continuïteit of goede werking en zonder gegarandeerde ondersteuning.' },
  'Nous recommandons de ne pas l’utiliser pour partager des informations sensibles ou confidentielles.': { en: 'We recommend not using it to share sensitive or confidential information.', fr: 'Nous recommandons de ne pas l’utiliser pour partager des informations sensibles ou confidentielles.', nl: 'We raden af deze dienst te gebruiken voor het delen van gevoelige of vertrouwelijke informatie.' },
  'Vous souhaitez développer une solution sur mesure ? Découvrez Overworks.': { en: 'Looking to build a custom solution? Discover Overworks.', fr: 'Vous souhaitez développer une solution sur mesure ? Découvrez Overworks.', nl: 'Wil je een oplossing op maat laten ontwikkelen? Ontdek Overworks.' },
}

const LANGUAGE_KEY = 'quickscreen-language'
const textNodes = new WeakMap<Text, { source: string; translated: string }>()
const attributeValues = new WeakMap<Element, Map<string, { source: string; translated: string }>>()
let language: Language = readLanguage()
document.documentElement.lang = language

function readLanguage(): Language {
  try {
    const value = localStorage.getItem(LANGUAGE_KEY)
    return value === 'fr' || value === 'nl' || value === 'en' ? value : 'en'
  } catch {
    return 'en'
  }
}

function translated(source: string): string {
  const trimmed = source.trim()
  const validationMatch = trimmed.match(/^Configuration valide \((\d+) serveurs ICE\)\.$/)
  if (validationMatch) {
    const count = validationMatch[1]
    const message: Record<Language, string> = {
      en: `Valid configuration (${count} ICE servers).`,
      fr: `Configuration valide (${count} serveurs ICE).`,
      nl: `Instellingen geldig (${count} ICE-servers).`,
    }
    return source.replace(trimmed, message[language])
  }
  const httpErrorPrefix = 'La requête Metered a échoué (HTTP '
  if (trimmed.startsWith(httpErrorPrefix)) {
    const code = trimmed.slice(httpErrorPrefix.length).replace(/\)\.$/, '')
    const message: Record<Language, string> = {
      en: `Metered request failed (HTTP ${code}).`,
      fr: `La requête Metered a échoué (HTTP ${code}).`,
      nl: `Metered-aanvraag mislukt (HTTP ${code}).`,
    }
    return source.replace(trimmed, message[language])
  }
  const entry = translations[trimmed]
  if (!entry) return source
  return source.replace(trimmed, entry[language])
}

function localizeText(node: Text) {
  const current = node.data
  let state = textNodes.get(node)
  if (!state || current !== state.translated) state = { source: current, translated: current }
  const result = translated(state.source)
  state.translated = result
  textNodes.set(node, state)
  if (current !== result) node.data = result
}

function localizeAttribute(element: Element, name: string) {
  const current = element.getAttribute(name)
  if (current === null) return
  let values = attributeValues.get(element)
  if (!values) { values = new Map(); attributeValues.set(element, values) }
  let state = values.get(name)
  if (!state || current !== state.translated) state = { source: current, translated: current }
  const result = translated(state.source)
  values.set(name, { source: state.source, translated: result })
  if (current !== result) element.setAttribute(name, result)
}

export function localize(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) localizeText(node as Text)
  if (root instanceof Element) localizeElement(root)
  root.querySelectorAll?.('*').forEach(localizeElement)
}

function localizeElement(element: Element) {
  for (const name of ['aria-label', 'placeholder', 'title']) localizeAttribute(element, name)
}

export function getLanguage(): Language { return language }

export function setLanguage(value: Language) {
  language = value
  document.documentElement.lang = value
  try { localStorage.setItem(LANGUAGE_KEY, value) } catch { /* Language remains active for this page. */ }
}
