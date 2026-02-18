# Nebgradnja — Građevinska firma (Construction Company Website)

Static single-page website in Serbian for a construction company. Two audiences: people looking for **jobs** (posao) and those looking to **hire workers** (radnike). Latin and Cyrillic script switcher; contact form via Formspree; professional mobile layout.

## Tech stack

- **Static HTML + CSS + JavaScript** — no build step.
- **Formspree** — contact form submissions go to your email.
- **Serbian** — Latin and Cyrillic (Ћирилица) with a header switcher; preference saved in `localStorage`.

## Formspree setup

1. Sign up at [formspree.io](https://formspree.io).
2. Create a new form and copy your form ID.
3. In `index.html`, replace `YOUR_FORM_ID` in the form `action`:

   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```

   Example: `action="https://formspree.io/f/xyzabcde"`

## Replacing placeholders

- **Images**: The site uses [placehold.co](https://placehold.co) URLs (e.g. Hero, O nama, Galerija). To use your own:
  - Add images to the `assets/` folder (or keep using external URLs).
  - In `index.html`, replace the `src` of each `<img>` with your file path (e.g. `assets/hero.jpg`) or new URL.
- **Video**: The “Video će biti dodato” block in the Galerija section is a placeholder. Replace the `.video-placeholder` block with your embed (e.g. YouTube iframe) or link to a video page.
- **Phone and email**: Search for `+381 11 123 4567` and `kontakt@nebgradnja.rs` in `index.html` and update to your real number and email (in both the Contact section and the footer).

## Git-based deployment

1. **Push to Git**  
   Initialise a repo (if needed), then push this folder to GitHub, GitLab, or Bitbucket.

2. **Deploy**  
   - **Netlify**: Connect the repo → build command empty, publish directory `/` (root) → optional custom domain in Netlify DNS/settings.  
   - **Vercel**: Import repo → framework “Other” / static → root directory `.` → optional domain in project settings.  
   - **GitHub Pages**: Settings → Pages → Source “Deploy from branch” → branch `main`, folder `/ (root)`.

3. **After deploy**  
   Set the Formspree form ID in `index.html` (see above) and replace image/video placeholders and contact details as needed.

## File structure

```
/
  index.html       # Single page; sections use data-i18n for script switching
  styles/
    main.css       # Variables, mobile-first layout, breakpoints
  scripts/
    main.js        # Smooth scroll, form feedback, hamburger menu
    i18n.js        # Latin/Cyrillic content + switcher + localStorage
  assets/          # Add your images here and update paths in index.html
  netlify.toml     # Optional Netlify config
  vercel.json      # Optional Vercel config
  README.md        # This file
```

## Local preview

Open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the URL shown (e.g. `http://localhost:8000`).
