# bar-madar.github.io

Website for [Tokenmeter](https://github.com/bar-madar/claude-tokenmeter) and TokenDiet: <https://bar-madar.github.io/>

Static HTML with no framework, no dependencies, no cookies and no third-party requests. GitHub Pages serves the built `docs/` folder.

## Layout

```text
src/layout.cjs     page shell: SEO and social tags, structured data, header, breadcrumbs, footer
src/pages.cjs      every page's content
src/build.cjs      builds docs/ and checks it (fails on problems)
src/assets/        stylesheet, copy-button script, favicon
src/images/        rendered images (from tools/render.cjs)
tools/render.cjs   renders social cards and screenshots with headless Edge or Chrome
docs/              the built site (committed; served by GitHub Pages)
```

## Commands

```bash
node tools/render.cjs   # re-render images (needs the tokendiet and claude-tokenmeter repos next to this one)
node src/build.cjs      # build docs/ and run the checks
python -m http.server 4600 --directory docs   # preview at http://127.0.0.1:4600
```

The build fails on: duplicate or badly sized titles and descriptions, pages without exactly one `<h1>`, images without alt text or dimensions, broken internal links or anchors, missing social images, invalid structured data, and anything loaded from another site.

## Going live with TokenDiet

When the Agensi listing is live, set `agensiUrl` in `src/layout.cjs`, rebuild and push. The "coming soon" buttons become purchase links and the structured data switches to in stock.

## Questions

[Open an issue](https://github.com/bar-madar/bar-madar.github.io/issues). Replies within 2 business days.
