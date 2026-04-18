# Community Butchery Website

This repository contains the static website for the community meat buy organised by Jason and friends. The goal of the site is to provide a central place to:

- List the primal cuts available for purchase (from local wholesale sources like Costco).
- Estimate the number of steaks or roasts each primal can yield.
- Allow friends to reserve their desired portions through an external form or manual contact (no payments processed on the site).
- Educate visitors on the different cuts of beef and pork.

## Repository structure

- `index.html` – main webpage with sections for how it works, available cuts and educational links.
- `styles.css` – basic styling for layout, tables and typography.
- `script.js` – small placeholder script; this can be expanded later to handle dynamic interactions.
- `assets/` – a folder you can add if you want to include images or other static assets.
- `README.md` – this file.

## Contributing and deployment

At this stage, the site is static. You can open `index.html` in a browser to preview. To host it via GitHub Pages, push the files to a repository and enable Pages to build from the `main` branch.

If you use a custom domain like **butchery.jasonheger.com**, configure a CNAME record in your DNS provider pointing to `jasonheger.github.io` and set the custom domain in your repository's Pages settings.

Pull requests are welcome for improvements. Please do not add any payment processing features; this site is for reservations and education only.