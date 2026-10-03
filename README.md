# What are we cooking? 🍴

16 dishes. One winner. A tiny knockout tournament to decide what to cook for lunch.

Static site: HTML + CSS + vanilla JS, no build step, no backend.

```
/index.html
/style.css
/script.js
/assets/
  favicon.svg
  dishes/        ← optional photos go here
```

## Publish on GitHub Pages

1. Create a new repository on GitHub and push these files to the `main` branch (keep them at the repo root).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<username>.github.io/<repo-name>/`.

## Adding real photos

Every dish already has an illustrated tile (warm gradient + emoji), so the site works without any images.
To use photos, add a JPG to `assets/dishes/` with the matching name. It fades in over the tile automatically:

| Dish | File |
|---|---|
| Paccheri con crema di peperoni | `paccheri.jpg` |
| Spaghetti pesto, patate e fagiolini | `pesto.jpg` |
| Spätzle di spinaci | `spatzle.jpg` |
| Risotto alle zucchine | `risotto-zucchine.jpg` |
| Pasta zucchine + crema di ceci | `pasta-ceci.jpg` |
| Risotto alla zucca | `risotto-zucca.jpg` |
| Pizza rossa | `pizza.jpg` |
| Focaccia schiacciata | `focaccia.jpg` |
| Gyoza | `gyoza.jpg` |
| Riso basmati + tofu + lenticchie + verdure saltate | `basmati.jpg` |
| Noodles alle verdure | `noodles.jpg` |
| Thai curry + riso | `thai-curry.jpg` |
| Piadina ripiena | `piadina.jpg` |
| Hummus + verdure saltate | `hummus.jpg` |
| Vellutata + crostini | `vellutata.jpg` |
| Funny-shaped potatoes al forno | `patate.jpg` |

Tips: landscape crops around 1200×900 px, under 250 KB each (compress with squoosh.app). Filenames are case-sensitive on GitHub Pages.
To use a different file or an external URL for one dish, edit its `image` in the `DISHES` list at the top of `script.js`.

## Customising

All text lives at the top of `script.js`: dish names, one-line descriptions, the "Apparently, we're making…" verdicts, and the microcopy lists (`QUIPS`, `WINNER_LINES`, the wildcard lines).

## Behaviour notes

- **Progress is saved** in `localStorage`, so a refresh resumes the tournament. "↺ Ricomincia" (tap twice) starts over with a new random draw.
- **SEND THE VERDICT** opens the phone's share sheet (or copies to the clipboard) with a link like `…/#verdict=gyoza`. Opening that link shows the result directly.
- Keyboard on desktop: ← / → (or 1 / 2) picks a dish.
- Respects `prefers-reduced-motion`.
