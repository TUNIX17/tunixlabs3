# /public/audio

Static audio assets served from the Next.js public root.

## tick.ogg (pending)

Expected: ~80ms Opus-encoded sine-wave click used by the "open a shell" Rive CTA (sprint-4).
When this file is present, set `NEXT_PUBLIC_CTA_AUDIO=1` and the Rive state machine
fires the `audio_click` event through the host page's `AudioContext` on first user gesture.

### Generating the asset locally

Requires `ffmpeg` with `libopus`:

```bash
ffmpeg -f lavfi -i "sine=frequency=800:duration=0.08" -c:a libopus public/audio/tick.ogg -y
```

### Build hosts without ffmpeg

The sprint-4 build host lacks `ffmpeg`/`sox`/`oggenc`, so `NEXT_PUBLIC_CTA_AUDIO` defaults
to `0` and `OpenShellCta` renders the plain terminal-icon button (no WASM, no audio). Flip
the flag to `1` after dropping a `tick.ogg` into this directory on a dev machine that has
`ffmpeg` installed.
