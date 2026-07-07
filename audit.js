/* Bug audit — usa un parser HTML real (no regex frágiles) */
const fs = require("fs");
const { parse } = require("node-html-parser");

const pages = fs.readdirSync(".").filter(f => f.endsWith(".html") && !f.startsWith("_"));
let problems = 0;
const log = (m) => { console.log("  " + m); problems++; };

for (const p of pages) {
  const html = fs.readFileSync(p, "utf8");
  const root = parse(html, { comment: false });

  // 1. exactly one main, one h1
  const mains = root.querySelectorAll("main");
  if (mains.length !== 1) log(`[${p}] <main> count = ${mains.length}`);
  const h1s = root.querySelectorAll("h1");
  if (h1s.length !== 1) log(`[${p}] <h1> count = ${h1s.length}`);

  // 2. duplicate IDs
  const ids = root.querySelectorAll("[id]").map(e => e.getAttribute("id"));
  const dups = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
  if (dups.length) log(`[${p}] duplicate id(s): ${dups.join(", ")}`);

  // 3. images without alt
  const imgs = root.querySelectorAll("img");
  const noAlt = imgs.filter(i => i.getAttribute("alt") === undefined);
  if (noAlt.length) log(`[${p}] ${noAlt.length} <img> missing alt`);

  // 4. empty href="" or href="#" that are real buttons (informational)
  const emptyHref = root.querySelectorAll('a[href="#"]').length;
  // (not counted as bug — placeholders — but report count)
  if (emptyHref) console.log(`  [info] ${p}: ${emptyHref} placeholder links (href="#")`);

  // 5. labels reference existing input ids
  const labels = root.querySelectorAll("label[for]");
  for (const l of labels) {
    const t = l.getAttribute("for");
    if (!root.querySelector(`#${t}`)) log(`[${p}] <label for="${t}"> has no matching field`);
  }

  // 6. heading order sanity (no h3 before any h2, etc. — soft check per doc)
  // skipped as soft.

  // 7. links with target=_blank without rel noopener
  const blanks = root.querySelectorAll('a[target="_blank"]');
  for (const b of blanks) {
    const rel = b.getAttribute("rel") || "";
    if (!/noopener/.test(rel)) log(`[${p}] target=_blank without rel=noopener: ${b.getAttribute("href")}`);
  }
}
console.log(problems ? `\n  ✗ ${problems} problems found` : "\n  ✓ no structural/a11y problems");
