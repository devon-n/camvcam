# Photo sources

## Shared pool (Guess + Compare)

**Dataset:** [FiveCam](https://huggingface.co/datasets/l-li/five-cam-xyz-rgb-1024) (Uni-ISP)  
**License:** MIT  
**Paper:** Li et al., “Uni-ISP: Unifying the Learning of ISPs from Multiple Cameras,” arXiv:2406.01003, 2024.

**What we took:** 60 same-scene pairs (iPhone 14 Pro Max ↔ Pixel 6 Pro), sharpness-filtered.  
Each JPEG is stored once under `public/images/singles/`.

| Index | File | Role |
|-------|------|------|
| Guess | `public/data/singles.json` | 120 entries (both sides of each pair) |
| Compare | `public/data/pairs.json` | 60 `{iphone, android}` id pairs |

Skipped older FiveCam phones (S20, P40) and Mi 12 for this cut (Pixel preferred when both exist).

Raw HF cache / full extract: gitignored (`data/raw/`, HF hub cache).
