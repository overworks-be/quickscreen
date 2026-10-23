# QuickScreen

Partage d’écran WebRTC entre deux navigateurs, sans compte ni serveur applicatif. PeerJS Cloud fournit la signalisation; le flux vidéo circule directement entre appareils lorsque leur réseau le permet.

## Développement

```sh
npm install
npm run dev
```

La capture d’écran nécessite une origine sécurisée (HTTPS ou `localhost`). Le diffuseur doit accepter explicitement la demande du navigateur. Le spectateur n’a besoin ni de caméra ni de microphone.

## Publication sur GitHub Pages

Le build utilise `/ios-webscreenshare/` comme chemin de base. Si le dépôt porte un autre nom, modifiez `base` dans `vite.config.ts` pour `/NOM-DU-DEPOT/`. Poussez ensuite sur `main`. Le workflow `.github/workflows/deploy.yml` active GitHub Pages, construit et publie le site automatiquement.

## Limites réseau et confidentialité

Les salons sont éphémères et utilisent un code aléatoire de huit caractères; aucune vidéo n’est enregistrée. PeerJS Cloud assure uniquement la signalisation. La connexion vidéo tente STUN pour établir un chemin pair à pair. Certains réseaux et pare-feu exigent un relais TURN, qui n’est pas inclus dans ce MVP. Dans ces réseaux, la connexion peut échouer.

Le partage s’arrête au bout de 30 secondes; changez `ROOM_DURATION_SECONDS` dans `src/main.ts` pour ajuster cette limite. Un diffuseur et un spectateur sont pris en charge par salon. Safari/iOS et les navigateurs mobiles n’exposent pas tous la capture d’écran: QuickScreen vérifie `getDisplayMedia()` et n’imite jamais une capture indisponible.
