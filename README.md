# Jechris Singayan — Portfolio

A personal portfolio built with HTML, CSS, and vanilla JavaScript. No installation or build step is required.

## Preview

Open `html/index.html` in a browser, or serve the `html` folder locally:

```powershell
python -m http.server 8765 --bind 127.0.0.1 --directory html
```

Then visit http://127.0.0.1:8765. VS Code Live Server also works.

## Included interactions

- Filter work by Web or Python.
- Open project screenshots and role notes in a keyboard-accessible dialog. Escape closes it and restores focus.
- Create an eight-step rhythm and play/pause it at 100 BPM. Audio starts only after pressing play and pauses when the tab is hidden.
- Copy the email address, open the résumé, or use direct email and phone links.
- Mobile navigation, visible keyboard focus, and reduced-motion support.

## Editing

- `html/index.html`: content, project cards, contact details, and asset references.
- `html/style/styles.css`: layout, palette, and responsive styles.
- `html/script/script.js`: filters, project notes, menu, clipboard action, and rhythm pad.
- `html/images/` and `html/pdf/`: original screenshots, portrait, and résumé.

Project detail copy lives in the `notes` object in the script. Keep it consistent with the project cards. There are no live-demo or repository links because those destinations have not been supplied.

Clipboard copying may require localhost or HTTPS; a helpful fallback appears if the browser blocks it. Social links open in a separate tab.

## SnapGrade walkthrough

The first project includes a clearly labeled, browser-only sample with two preset lessons, three questions per lesson, answer explanations, progress, and mistake review. `html/script/walkthrough.js` owns the sample data and state. No live AI generation or backend connection is used. SnapGrade itself runs locally; no public demo or repository URL has been supplied.
