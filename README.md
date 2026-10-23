# QuickScreen

[Open QuickScreen](https://overworks-be.github.io/quickscreen/)

The interface is available in English, French, and Dutch. Choose a language from the selector in the top-right corner; your choice is saved in this browser. English is used by default.

Share your screen live between two browsers without an account or an application server. PeerJS Cloud handles signaling; the video stream travels directly between devices when their networks allow it.

## Development

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` if you want to enable relay-only diagnostics with `VITE_WEBRTC_FORCE_RELAY=true`.

Screen capture requires a secure origin (HTTPS or `localhost`). The person sharing must explicitly approve the browser’s capture request. Viewers do not need a camera or microphone.

## Deploy to GitHub Pages

The build uses `/quickscreen/` as its base path. If the repository has a different name, update `base` in `vite.config.ts` to `/REPOSITORY-NAME/`. In **Settings → Pages**, select **GitHub Actions** as the source. Then push to `main`; the `.github/workflows/deploy.yml` workflow builds and deploys the site automatically.

## Presenter TURN configuration

1. Create a Metered application and TURN credential in the Metered dashboard.
2. Open that credential and copy its **Credential API Key**. See [Metered's credential API guide](https://www.metered.ca/docs/turn-rest-api/get-credential/) for where to find it. Do not use the account **Secret Key**.
3. As the presenter, open **Configuration TURN** in your room, enter the Metered application name and Credential API Key, then select **Tester la configuration** and **Enregistrer**. **Réinitialiser** removes the saved settings and returns the presenter to STUN only.

Settings are stored in `sessionStorage` by default and are cleared when the browser tab session ends. Select **Mémoriser sur ce navigateur** to store them in `localStorage` instead. The Metered Credential API Key is scoped to a TURN credential, but it remains readable by the presenter browser and may consume its quota. Use a limited credential, monitor usage, and rotate or revoke it if needed. Never enter the Metered account Secret Key.

Only the presenter browser calls Metered. It fetches the ICE server list when the presenter opens a room and caches it in memory for that page. The viewer uses public STUN only and receives no Metered configuration or credentials. The invitation URL contains only the room code. If Metered is unavailable, the presenter falls back to STUN and sees a warning. A presenter-side relay candidate can work with a STUN-only viewer, but this is not guaranteed on restrictive networks or firewalls.

## WebRTC diagnostics and manual checks

In development (`npm run dev`), open the **WebRTC diagnostics** panel during a live call to see the PeerConnection state, ICE state, local and remote selected candidate types, and whether the path uses P2P or TURN. It never displays TURN credentials. Set `VITE_WEBRTC_FORCE_RELAY=true` in `.env.local`, or as a GitHub Actions repository variable for a diagnostic deployment, to require relay candidates on the presenter only; the viewer continues to use STUN only. If Metered TURN cannot connect, the call fails instead of silently switching to direct P2P.

The production build is checked with `npm run build`. Browser-to-browser tests require two devices and a valid Metered credential, so perform these checks manually:

- Join before and after screen sharing starts, on the same Wi-Fi and across Wi-Fi/mobile networks.
- Confirm a `relay` candidate at the presenter in diagnostics with relay-only mode, and confirm that the call fails when TURN is unavailable in that mode.
- Temporarily use an invalid API key or block the Metered API and confirm the STUN fallback warning appears.
- Confirm the visitor never requests the Metered credential endpoint and needs no setup of their own.
- Stop the share manually and close the room; verify video and PeerJS connections are released. Sharing has no 30-second automatic timeout.

## Network and privacy limits

Rooms are temporary and use a random eight-character code. No video is recorded. PeerJS Cloud handles signaling only. The presenter prefers a direct peer-to-peer path and can use Metered TURN when direct connectivity is unavailable. TURN configured only at the presenter may be insufficient when the viewer's network blocks the required traffic. TURN availability also depends on the configured Metered credential and its quota.

Sharing remains active until the host stops it manually or ends capture in the browser. Each room supports one host and one viewer. Safari/iOS and mobile browsers do not all support screen capture; QuickScreen checks for `getDisplayMedia()` and never simulates unsupported capture.
