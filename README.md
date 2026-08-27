# omp-random-theme 🎨

An extension for [Oh My Pi (`omp`)](https://github.com/can1357/oh-my-pi) that automatically applies a fresh, random theme on startup and provides slash commands to roll new themes on the fly.

## Features

- 🎲 **Automatic Startup Randomization**: Switches to a new theme every time you launch `omp`.
- 🌓 **Smart Candidate Selection**: Discovers all built-in and custom themes in your environment and avoids picking the theme you currently have active.
- ⚡ **Interactive Slash Commands**:
  - `/roll-theme [dark|light|all]` — Shuffle to a different theme immediately.
  - `/list-themes [dark|light|all]` — View the count of available themes and your active theme.
- 🏎️ **Zero Overhead**: Uses native OMP extension hooks (`session_start` and `ctx.ui.setTheme`).

---

## Installation

### Option 1: Drop directly into your user extensions (Fastest)

Symlink or copy `src/index.ts` to your user extensions directory:

```bash
# Symlink for live updates from this repository
ln -sf "$(pwd)/src/index.ts" ~/.omp/agent/extensions/omp-random-theme.ts
```

Or copy directly:

```bash
cp src/index.ts ~/.omp/agent/extensions/omp-random-theme.ts
```

### Option 2: Add to `config.yml`

Add the path to your `~/.omp/agent/config.yml`:

```yaml
extensions:
  - /path/to/omp-random-theme
```

### Option 3: Test on a single run

```bash
omp --extension /path/to/omp-random-theme
```

---

## Commands

| Command | Description |
|---|---|
| `/roll-theme` | Randomly switches to another dark theme |
| `/roll-theme light` | Randomly switches to a light theme |
| `/roll-theme all` | Randomly switches across all installed themes |
| `/list-themes` | Shows the active theme and candidate count |

---

## Included Themes Sample

Includes support for all built-in OMP themes:

- `dark-catppuccin`, `dark-tokyo-night`, `dark-synthwave`, `dark-dracula`
- `dark-nord`, `dark-gruvbox`, `dark-rose-pine`, `dark-cyberpunk`
- `dark-solarized`, `dark-monokai`, `dark-poimandres`, `dark-one`
- `dark-abyss`, `dark-arctic`, `dark-aurora`, `dark-forest`, `dark-sunset`
- and all custom themes located in `~/.omp/agent/themes/`

---

## License

MIT © [mcfa77y](https://github.com/mcfa77y)
