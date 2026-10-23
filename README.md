# QuickScreen

[Open QuickScreen](https://overworks-be.github.io/ios-webscreenshare/)

Share your screen live between two browsers without an account or an application server. PeerJS Cloud handles signaling; the video stream travels directly between devices when their networks allow it.

## Development

```sh
npm install
npm run dev
```

Screen capture requires a secure origin (HTTPS or `localhost`). The person sharing must explicitly approve the browser’s capture request. Viewers do not need a camera or microphone.

## Deploy to GitHub Pages

The build uses `/ios-webscreenshare/` as its base path. If the repository has a different name, update `base` in `vite.config.ts` to `/REPOSITORY-NAME/`. In **Settings → Pages**, select **GitHub Actions** as the source. Then push to `main`; the `.github/workflows/deploy.yml` workflow builds and deploys the site automatically.

## Network and privacy limits

Rooms are temporary and use a random eight-character code. No video is recorded. PeerJS Cloud handles signaling only. The video connection uses STUN to try to establish a peer-to-peer path. Some networks and firewalls require a TURN relay, which is not included in this MVP; connections may fail on those networks.

Sharing remains active until the host stops it manually or ends capture in the browser. Each room supports one host and one viewer. Safari/iOS and mobile browsers do not all support screen capture; QuickScreen checks for `getDisplayMedia()` and never simulates unsupported capture.
