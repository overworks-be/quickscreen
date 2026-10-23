function escapeAttribute(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
}

export function overworksUrl(): string {
  const configured = import.meta.env.VITE_OVERWORKS_URL?.trim() || 'https://www.overworks.be/'
  try {
    const url = new URL(configured)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : 'https://www.overworks.be/'
  } catch {
    return 'https://www.overworks.be/'
  }
}

export function footerMarkup(siteUrl: string) {
  const href = escapeAttribute(siteUrl)
  return `<footer class="site-footer"><p class="site-footer-signature">QuickScreen — Un service expérimental gratuit proposé par Overworks</p><p class="site-footer-note">Interface hébergée sur GitHub Pages · Service fourni en l’état, sans garantie de disponibilité</p><nav class="site-footer-links" aria-label="Informations"><button class="text-link" id="about-open" type="button">À propos</button><a class="text-link" href="${href}" target="_blank" rel="noopener noreferrer">Découvrir Overworks <span aria-hidden="true">↗</span></a></nav></footer>`
}

