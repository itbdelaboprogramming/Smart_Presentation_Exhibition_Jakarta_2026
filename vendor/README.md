# vendor/ — offline third-party assets


## Switching OFFLINE / ONLINE

marked `OFFLINE` and `ONLINE`. Keep exactly
one uncommented, and switch all three files together.

| File | Block |
|---|---|
| `index.php` | gsap, es-module-shims, import map |
| `style/style.css` | the two font `@import` lines |
| `script.js` | `const DRACO_PATH` |





## What is here

| Path | Version | Replaces |
|---|---|---|
| `three/build/three.module.js` | 0.154.0 | `unpkg.com/three@0.154.0/build/` |
| `three/examples/jsm/**` (16 files) | 0.154.0 | `unpkg.com/three@0.154.0/examples/jsm/` |
| `draco/` | 1.5.6 | `www.gstatic.com/draco/versioned/decoders/1.5.6/` |
| `gsap/gsap.js` | 3.2.4 | `cdn.jsdelivr.net/npm/gsap@3.2.4/dist/` |
| `es-module-shims/es-module-shims.js` | 1.6.3 | `unpkg.com/es-module-shims@1.6.3/dist/` |
| `fonts/` (Inter, Ubuntu + 13 woff2) | — | `fonts.googleapis.com` + `fonts.gstatic.com` |

