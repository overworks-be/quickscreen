# QuickScreen

[Open QuickScreen](https://overworks-be.github.io/ios-webscreenshare/)

Share your screen live between two browsers without an account or an application server. PeerJS Cloud handles signaling; the video stream travels directly between devices when their networks allow it.

## Development

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the Metered values described below. Vite loads these values for local development.

Screen capture requires a secure origin (HTTPS or `localhost`). The person sharing must explicitly approve the browser’s capture request. Viewers do not need a camera or microphone.

## Deploy to GitHub Pages

The build uses `/ios-webscreenshare/` as its base path. If the repository has a different name, update `base` in `vite.config.ts` to `/REPOSITORY-NAME/`. In **Settings → Pages**, select **GitHub Actions** as the source. Then push to `main`; the `.github/workflows/deploy.yml` workflow builds and deploys the site automatically.

## Metered STUN/TURN setup

1. Create a Metered application and a TURN credential in the Metered dashboard.
2. Open that credential and copy its **Credential API Key** (the key shown for the TURN credential). Do not use the account **Secret Key** in this frontend.
3. Set `VITE_METERED_APP` to the Metered application name and `VITE_METERED_CREDENTIAL_API_KEY` to that credential's API key. Locally, put them in `.env.local`. For GitHub Pages, add them under **Settings → Secrets and variables → Actions → Variables** with the same names. `VITE_WEBRTC_FORCE_RELAY` can be set to `true` for a relay-only diagnostic build; keep it `false` in production.

Vite embeds every `VITE_*` value in the published JavaScript. The Metered Credential API Key is scoped to a TURN credential, but visitors can retrieve it and may consume its quota. Monitor its usage and rotate or revoke it if needed. Never put the Metered account Secret Key in frontend code or GitHub Actions variables used by this client.

QuickScreen requests Metered's ICE server list when a room is opened and caches the result in memory for that page. If the API is missing or unavailable, it falls back to public STUN and shows a warning. Direct P2P remains enabled unless relay-only diagnostic mode is explicitly enabled. STUN fallback cannot guarantee connections across restrictive NATs or firewalls.

## WebRTC diagnostics and manual checks

In development (`npm run dev`), open the **WebRTC diagnostics** panel during a live call to see the PeerConnection state, ICE state, selected candidate type and whether the path uses P2P or TURN. It never displays TURN credentials. Set `VITE_WEBRTC_FORCE_RELAY=true` to require relay candidates; if Metered TURN cannot connect, the call fails instead of silently switching to direct P2P.

The production build is checked with `npm run build`. Browser-to-browser tests require two devices and a valid Metered credential, so perform these checks manually:

- Join before and after screen sharing starts, on the same Wi-Fi and across Wi-Fi/mobile networks.
- Confirm a `relay` candidate in diagnostics with relay-only mode, and confirm that the call fails when TURN is unavailable in that mode.
- Temporarily use an invalid API key or block the Metered API and confirm the STUN fallback warning appears.
- Stop the share manually and close the room; verify video and PeerJS connections are released.

## Network and privacy limits

Rooms are temporary and use a random eight-character code. No video is recorded. PeerJS Cloud handles signaling only. The video connection prefers a direct peer-to-peer path and can use Metered TURN when direct connectivity is unavailable. Some networks may still block WebRTC; TURN availability depends on the configured Metered credential and its quota.

Sharing remains active until the host stops it manually or ends capture in the browser. Each room supports one host and one viewer. Safari/iOS and mobile browsers do not all support screen capture; QuickScreen checks for `getDisplayMedia()` and never simulates unsupported capture.
