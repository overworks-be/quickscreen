function escapeAttribute(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
}

export function aboutModalMarkup(siteUrl: string) {
  const href = escapeAttribute(siteUrl)
  return `<dialog class="about-modal" id="about-dialog" aria-labelledby="about-title" aria-describedby="about-description"><div class="about-modal-content"><button class="about-close" id="about-close" type="button" aria-label="Fermer" autofocus>×</button><p class="eyebrow">OVERWORKS</p><h2 id="about-title">QuickScreen — Une expérimentation Overworks</h2><div id="about-description"><p>QuickScreen est un outil gratuit de démonstration technologique (Proof of Concept), développé par Overworks.</p><p>Son interface est hébergée via GitHub Pages. Les communications WebRTC peuvent utiliser des services tiers de signalisation ou de relais TURN.</p><p>Ce service est fourni en l’état, sans garantie de disponibilité, de continuité ou de bon fonctionnement et sans support garanti.</p><p>Nous recommandons de ne pas l’utiliser pour partager des informations sensibles ou confidentielles.</p><p>Vous souhaitez développer une solution sur mesure ? Découvrez Overworks.</p></div><div class="about-modal-actions"><a class="button primary" href="${href}" target="_blank" rel="noopener noreferrer">Découvrir Overworks <span aria-hidden="true">↗</span></a><button class="button secondary" id="about-close-action" type="button">Fermer</button></div></div></dialog>`
}

export function wireAboutModal() {
  const dialog = document.querySelector<HTMLDialogElement>('#about-dialog')
  if (!dialog) return
  const close = () => dialog.close()
  document.querySelector('#about-close')?.addEventListener('click', close)
  document.querySelector('#about-close-action')?.addEventListener('click', close)
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close()
  })
  document.querySelector<HTMLButtonElement>('#about-open')?.addEventListener('click', () => dialog.showModal())
}
