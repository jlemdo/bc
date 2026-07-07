/* =============================================================
   build.js — Ensambla páginas estáticas a partir de:
     partials/_header.html · partials/_footer.html
     pages/<name>.main.html  (+ front-matter JSON en 1ª línea comentada)
   Genera <name>.html en la raíz.
   Uso:  node build.js
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const header = fs.readFileSync(path.join(ROOT, "partials/_header.html"), "utf8");
const footer = fs.readFileSync(path.join(ROOT, "partials/_footer.html"), "utf8");

const pagesDir = path.join(ROOT, "pages");
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith(".main.html"));

const head = (meta, extraCss) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />

  <!-- Google Fonts (portables a WordPress) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="assets/css/tokens.css" />
  <link rel="stylesheet" href="assets/css/base.css" />
  <link rel="stylesheet" href="assets/css/components.css" />
  <link rel="stylesheet" href="assets/css/page.css" />${extraCss}
</head>
<body>
`;

let built = [];
for (const file of files) {
  const raw = fs.readFileSync(path.join(pagesDir, file), "utf8");
  // Front-matter: first line "<!--META {json} -->"
  const m = raw.match(/^<!--META\s+([\s\S]*?)-->\s*/);
  if (!m) { console.error("No META in", file); continue; }
  const meta = JSON.parse(m[1]);
  const mainHtml = raw.slice(m[0].length);
  const extraCss = meta.css ? `\n  <link rel="stylesheet" href="assets/css/${meta.css}" />` : "";
  const out = head(meta, extraCss) + header + "\n" + mainHtml.trimEnd() + "\n\n" + footer + "\n</body>\n</html>\n";
  const outName = file.replace(".main.html", ".html");
  fs.writeFileSync(path.join(ROOT, outName), out);
  built.push(outName);
}
console.log("Built:", built.join(", "));
