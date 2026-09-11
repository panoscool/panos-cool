# panoscool

My personal page: a short intro, the apps I've shipped (each with a launch button),
and links to GitHub and Buy Me a Coffee.

Plain HTML, CSS and JavaScript — no framework, no build step, no dependencies.

## Run it

Open `index.html` directly, or serve the folder:

```bash
npx serve .          # or: python3 -m http.server 4321
```

## Edit the content

Everything on the page comes from **`assets/js/data.js`**:

| Field                  | What it does                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `links`                | GitHub / Buy Me a Coffee / LinkedIn URLs                         |
| `console`              | Lines typed out in the hero terminal (`cmd` = input, `out` = response) |
| `apps[]`               | One card each: `title`, `tagline`, `description`, `url`, `host`, `tags`, `accent`, `icon` |
| `packages[]`           | The small npm strip under the grid — delete the array to hide it  |

App icons are inline SVG so they follow the theme. To use a real logo instead,
add `logo: 'assets/img/my-logo.png'` to that app — the SVG in `icon` is kept as a
fallback if the image fails to load.

The intro paragraph, name and role live in `index.html` (the `.hero__copy` block).

## Theming

Light and dark are both first-class. Colours are CSS custom properties defined three
times in `assets/css/styles.css`: once on `:root` (light), once under
`prefers-color-scheme: dark` for visitors who haven't chosen, and once under
`[data-theme="dark"]` so the switch wins either way. The header switch cycles
**light / auto / dark** and remembers the choice in `localStorage`.

Animations (cursor glow, circuit pulses, typing console, reveals) all switch off under
`prefers-reduced-motion: reduce`.

## Deploy

Netlify is configured in `netlify.toml` (publish directory = repo root). Any static host
works — there is nothing to compile.
