# Hero carousel assets

The home page hero (`home-proposed.html`) crossfades 3 slides. The first slot looks for `hero-stage-01.jpg` here.

## Add your attached speaking photo

1. Save the attached conference photo as `hero-stage-01-raw.jpg` in this folder.
2. Crop to **2.7:1** (1620×600 recommended) with this ffmpeg one-liner:

   ```bash
   cd stardust/prototypes/assets
   ffmpeg -y -i hero-stage-01-raw.jpg \
     -vf "crop='min(iw,ih*2.7)':'min(ih,iw/2.7)',scale=1620:600" \
     hero-stage-01.jpg
   ```

3. Reload the prototype — the carousel will pick it up automatically as slide 1.

If `hero-stage-01.jpg` is missing, the carousel falls back to an Unsplash mountain image for slide 1; slides 2 and 3 are always Unsplash MTB / mountain photography.
