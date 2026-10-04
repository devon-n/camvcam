# camvcam

Guess whether a photo was shot on **iPhone** or **Android** — or compare the same scene side by side.

Live: [camvcam.com](https://camvcam.com/)

## Modes

- **Guess** — one mystery photo; pick iPhone or Android
- **Compare** — same scene, two phones; tap which side is the iPhone

Scores stay in the browser (`localStorage`). Share your result when you End.

## Stack

Vite + React + TypeScript. Static site (no backend).

## Develop

```bash
npm ci
npm run dev
```

HTTPS on the LAN (for phone share tray):

```bash
npx vite --host 0.0.0.0 --port 5714 --strictPort
```

Then open `https://localhost:5714/` (or your machine’s LAN IP). Accept the self-signed cert warning on first visit.

```bash
npm run build    # output in dist/
npm run preview  # serve the build
```

## Photos / sources

Images are from **[FiveCam](https://huggingface.co/datasets/l-li/five-cam-xyz-rgb-1024)** (Uni-ISP), MIT license.

- Paper: Li et al., “Uni-ISP: Unifying the Learning of ISPs from Multiple Cameras,” arXiv:2406.01003, 2024
- Devices in this build: **iPhone 14 Pro Max** ↔ **Google Pixel 6 Pro** (60 same-scene pairs, sharpness-filtered)
- Skipped from FiveCam for this cut: Galaxy S20, Huawei P40, Xiaomi Mi 12

Each JPEG is stored once under `public/images/singles/`.  
`public/data/pairs.json` indexes those pairs; Guess and Compare both use that file.

In-app **Credits** (info icon) links the dataset.

## License

App code: [MIT](LICENSE). Photo assets: FiveCam / Uni-ISP (MIT) with attribution.
