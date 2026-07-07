# BC Greenhouse Growers' Association — Website Redesign

Modern, responsive redesign for the **BC Greenhouse Growers' Association** (bcgreenhouse.ca),
built with plain HTML, CSS and JavaScript — ready to be ported to WordPress
(Gutenberg / Elementor / Astra) once approved.

## 🌱 Live preview

This is a static site. Open `index.html` in a browser, or serve the folder:

```bash
# con Python
python -m http.server 8000
# luego abre http://localhost:8000
```

Deployable directly to **GitHub Pages** (root of this repo).

## 📄 Pages

- `index.html` — Home
- `growers.html` — Growers (Who We Are + History)
- `greenhouses.html` — Greenhouses (environment, sustainability)
- `find-our-product.html` — Find Our Product
- `news.html` — News & Resources + Industry Reports
- `recipes.html` — Recipes
- `contact.html` — Contact

## 🎨 Design system

Everything is tokenized in `assets/css/tokens.css` (colors, typography, spacing,
shadows). Change a token once → it updates everywhere, and it maps cleanly to a
WordPress theme's Global Styles.

```
assets/
├── css/   tokens · base · components · home · page
├── js/    main.js  (vanilla, no dependencies)
└── img/   logo, buy-bc, photos
```

## 🛠 Editing & rebuilding

Header/footer are shared partials, and internal pages are assembled from sources:

```
partials/_header.html · _footer.html   ← edit once, affects every page
pages/*.main.html                       ← page-specific content
build.js                                ← node build.js  → regenerates the .html
```

To rebuild after editing a partial or a `pages/*.main.html`:

```bash
npm install      # first time only (installs node-html-parser)
node build.js    # regenerates all internal pages
```

`audit.js` runs a quick structural/accessibility/link check.

## 📝 Notes for the client

- Fonts: **Fraunces** (headings) + **Inter** (body), via Google Fonts.
- Some links are placeholders (`#`) for pages/content not yet built
  (individual recipes/posts, social media, governance pages, the store-guide PDF).
- **To confirm with the client** before publishing: the marketing-agency list on
  *Find Our Product* and the full recipe collections.

---

© BC Greenhouse Growers' Association.
