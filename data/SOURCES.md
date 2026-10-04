# Photo sources

## Guess mode (singles) — ready

**Dataset:** [VISION](https://lesc.dinfo.unifi.it/VISION/)  
**License:** [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)  
**Paper:** Shullani et al., “VISION: a video and image dataset for source identification,” EURASIP Journal on Information Security, 2017.  
**Credit:** CSP Lab, University of Florence  

**What we took:** 149 native natural-scene JPEGs (`images/nat/`), resized to max 1600px, ~306 KB avg.

| Label   | Count | Devices |
|---------|------:|---------|
| iPhone  | 77    | iPhone 4 / 4s / 5 / 5c / 6 / 6 Plus |
| Android | 72    | Samsung, Huawei, OnePlus, Xiaomi, Sony, LG, Lenovo, Asus, Wiko |

Files: `data/curated/singles/*.jpg` + `data/curated/singles.json`  
Opaque IDs in filenames so labels don’t leak.

ShareAlike note: if the site redistributes these images, the derivative image set should stay under CC BY-SA 4.0 with attribution (footer / credits page is enough).

## Compare mode (same-scene pairs) — not yet

Best public candidate:

| Dataset | Why it fits | Blocker |
|---------|-------------|---------|
| **SPCD / CDNet** | 667 scenes × 6 phones including iPhone 12 Pro + Android flagships | No clear open license; Google Drive / Baidu only |
| **SPAQ** | 1,000 same-scene multi-phone shots | Research-only; commercial use needs author permission |
| **SCIMD-6/17** | CC BY 4.0 | Android-only, 224×224 — useless for visual compare |

`pairs.json` is empty until we either:
1. manually download SPCD and confirm reuse is OK for a public site, or
2. shoot a small set of own pairs, or
3. email SPAQ authors for permission.

## Skipped

- **SCIMD:** license OK, resolution too low  
- **FlickrExif / LAION-Mobile:** license per-image or metadata-only  
- **ForensiCam-215K:** Baidu-only, license unclear  
