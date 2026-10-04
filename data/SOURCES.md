# Photo sources

## Guess mode (singles) — ready

**Dataset:** [FiveCam](https://huggingface.co/datasets/l-li/five-cam-xyz-rgb-1024) (Uni-ISP)  
**License:** MIT  
**Paper:** Li et al., “Uni-ISP: Unifying the Learning of ISPs from Multiple Cameras,” arXiv:2406.01003, 2024.  
**Credit:** Lingen Li et al. / Hugging Face `l-li/five-cam-xyz-rgb-1024`

**What we took:** Newest phones in FiveCam (2021–2022 cohort). Self-camera RGB JPEGs (1024×1024), sharpness-filtered.

| Label   | Count | Devices |
|---------|------:|---------|
| iPhone  | 60    | iPhone 14 Pro Max (2022) |
| Android | 60    | Pixel 6 Pro (2021), Xiaomi Mi 12 (2021/22) |

Skipped from FiveCam (older): Samsung Galaxy S20, Huawei P40 (2020).

Raw extract (all newest RGB, ~1460 imgs): `data/raw/fivecam/` (gitignored).  
Published deck: `public/images/singles/` + `public/data/singles.json`.

## Compare mode (same-scene pairs) — not yet

FiveCam is same-scene across 5 phones (synced shutter) — good candidate for Compare once we wire pairs. Full set also has S20 + P40 if needed for more Android variety.

## Previous (retired)

VISION (2017, phones through ~2016) was removed as too old for the quiz.
