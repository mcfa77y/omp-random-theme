import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";

// Curated list of high-quality dark themes included in Oh My Pi
export const DEFAULT_DARK_THEMES = [
  "dark-catppuccin",
  "dark-tokyo-night",
  "dark-synthwave",
  "dark-dracula",
  "dark-nord",
  "dark-gruvbox",
  "dark-rose-pine",
  "dark-cyberpunk",
  "dark-solarized",
  "dark-monokai",
  "dark-poimandres",
  "dark-one",
  "dark-abyss",
  "dark-arctic",
  "dark-aurora",
  "dark-copper",
  "dark-cosmos",
  "dark-eclipse",
  "dark-ember",
  "dark-equinox",
  "dark-forest",
  "dark-github",
  "dark-lavender",
  "dark-lunar",
  "dark-midnight",
  "dark-nebula",
  "dark-ocean",
  "dark-rainforest",
  "dark-reef",
  "dark-retro",
  "dark-sakura",
  "dark-slate",
  "dark-solstice",
  "dark-starfall",
  "dark-sunset",
  "dark-swamp",
  "dark-taiga",
  "dark-terminal",
  "dark-tundra",
  "dark-twilight",
  "dark-volcanic",
  "obsidian",
  "onyx",
  "basalt",
  "anthracite",
  "titanium",
];

export const DEFAULT_LIGHT_THEMES = [
  "light-catppuccin",
  "light-tokyo-night",
  "light-synthwave",
  "light-gruvbox",
  "light-solarized",
  "light-cyberpunk",
  "light-dawn",
  "light-paper",
  "light-arctic",
  "light-aurora-day",
  "light-canyon",
  "light-cirrus",
  "light-coral",
  "light-dunes",
  "light-eucalyptus",
  "light-forest",
  "light-frost",
  "light-github",
  "light-glacier",
  "light-haze",
  "light-honeycomb",
  "light-lagoon",
  "light-lavender",
  "light-meadow",
  "light-mint",
  "light-ocean",
  "light-one",
  "light-opal",
  "light-orchard",
  "light-poimandres",
  "light-prism",
  "light-retro",
  "light-sand",
  "light-savanna",
  "light-soleil",
  "light-sunset",
  "light-wetland",
  "light-zenith",
  "alabaster",
  "porcelain",
  "sandstone",
  "pearl",
  "quartz",
  "limestone",
  "birch",
  "marble",
];

/**
 * Pick a random theme from a list, avoiding the currently active theme if possible.
 */
export function pickRandomTheme(themes: string[], currentTheme?: string): string {
  if (!themes.length) return "dark-tokyo-night";

  const candidates =
    currentTheme && themes.length > 1
      ? themes.filter((t) => t.toLowerCase() !== currentTheme.toLowerCase())
      : themes;

  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}

/**
 * Resolve theme candidate list dynamically from available themes or curated list.
 */
export async function getCandidateThemes(
  ctx: ExtensionContext,
  mode: "dark" | "light" | "all" = "dark"
): Promise<string[]> {
  try {
    const available = await ctx.ui.getAllThemes();
    if (available && available.length > 0) {
      const names = available.map((t) => t.name);
      if (mode === "dark") {
        const darks = names.filter(
          (name) =>
            name.startsWith("dark-") ||
            DEFAULT_DARK_THEMES.includes(name) ||
            (!name.startsWith("light-") && !DEFAULT_LIGHT_THEMES.includes(name))
        );
        if (darks.length > 0) return darks;
      } else if (mode === "light") {
        const lights = names.filter(
          (name) => name.startsWith("light-") || DEFAULT_LIGHT_THEMES.includes(name)
        );
        if (lights.length > 0) return lights;
      }
      return names;
    }
  } catch {
    // Fall back to built-in curated defaults
  }

  if (mode === "light") return DEFAULT_LIGHT_THEMES;
  if (mode === "all") return [...DEFAULT_DARK_THEMES, ...DEFAULT_LIGHT_THEMES];
  return DEFAULT_DARK_THEMES;
}

/**
 * Apply a random theme and report via notification.
 */
async function applyRandomTheme(
  ctx: ExtensionContext,
  mode: "dark" | "light" | "all" = "dark",
  notify: boolean = true
): Promise<string | null> {
  if (!ctx.hasUI) return null;

  const currentTheme = ctx.ui.theme?.name;
  const candidates = await getCandidateThemes(ctx, mode);
  const selected = pickRandomTheme(candidates, currentTheme);

  const res = await ctx.ui.setTheme(selected);
  if (res.success) {
    if (notify) {
      ctx.ui.notify(`Applied random theme: ${selected}`, "info");
    }
    return selected;
  } else {
    if (notify && res.error) {
      ctx.ui.notify(`Failed to apply theme ${selected}: ${res.error}`, "warning");
    }
    return null;
  }
}

export default function randomThemeExtension(pi: ExtensionAPI) {
  // Randomize theme on session startup
  pi.on("session_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;
    await applyRandomTheme(ctx, "dark", true);
  });

  // Slash command: /roll-theme [dark|light|all]
  pi.registerCommand("roll-theme", {
    description: "Randomly pick and apply a theme (usage: /roll-theme [dark|light|all])",
    handler: async (args, ctx) => {
      const arg = args.trim().toLowerCase();
      const mode = arg === "light" ? "light" : arg === "all" ? "all" : "dark";
      await applyRandomTheme(ctx, mode, true);
    },
  });

  // Slash command: /list-themes [dark|light|all]
  pi.registerCommand("list-themes", {
    description: "List available themes for randomization",
    handler: async (args, ctx) => {
      const arg = args.trim().toLowerCase();
      const mode = arg === "light" ? "light" : arg === "all" ? "all" : "dark";
      const candidates = await getCandidateThemes(ctx, mode);
      const current = ctx.ui.theme?.name ?? "unknown";

      ctx.ui.notify(
        `Active: ${current} | ${candidates.length} ${mode} themes available. Use /roll-theme to shuffle.`,
        "info"
      );
    },
  });
}
