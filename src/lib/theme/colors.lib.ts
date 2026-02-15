import * as colorPalette from "@/theme/colors";
import { updateThemeSettings } from "./storage.lib";

type ColorDef = typeof colorPalette.amber | typeof colorPalette.neutral;
export type ColorKey = keyof typeof colorPalette;

export const colorTokens: Record<ColorKey, ColorDef> = {
  ...colorPalette,
};

export const grayTokens: Record<string, typeof colorPalette.neutral> = {
  neutral: colorPalette.neutral,
  mauve: colorPalette.mauve,
  olive: colorPalette.olive,
  sage: colorPalette.sage,
  sand: colorPalette.sand,
  slate: colorPalette.slate,
};

type ColorOption = {
  key: ColorKey;
  name: string;
  value: ColorDef;
  grayValue: ColorKey;
};

export const colors: Record<ColorKey, ColorOption> = {
  pink: {
    key: "pink",
    name: "Pink",
    value: colorPalette.pink,
    grayValue: "mauve",
  },
  crimson: {
    key: "crimson",
    name: "Crimson",
    value: colorPalette.crimson,
    grayValue: "mauve",
  },
  ruby: {
    key: "ruby",
    name: "Ruby",
    value: colorPalette.ruby,
    grayValue: "mauve",
  },
  red: {
    key: "red",
    name: "Red",
    value: colorPalette.red,
    grayValue: "mauve",
  },
  tomato: {
    key: "tomato",
    name: "Tomato",
    value: colorPalette.tomato,
    grayValue: "mauve",
  },
  orange: {
    key: "orange",
    name: "Orange",
    value: colorPalette.orange,
    grayValue: "sand",
  },
  amber: {
    key: "amber",
    name: "Amber",
    value: colorPalette.amber,
    grayValue: "sand",
  },
  yellow: {
    key: "yellow",
    name: "Yellow",
    value: colorPalette.yellow,
    grayValue: "sand",
  },
  lime: {
    key: "lime",
    name: "Lime",
    value: colorPalette.lime,
    grayValue: "olive",
  },
  grass: {
    key: "grass",
    name: "Grass",
    value: colorPalette.grass,
    grayValue: "olive",
  },
  green: {
    key: "green",
    name: "Green",
    value: colorPalette.green,
    grayValue: "sage",
  },
  jade: {
    key: "jade",
    name: "Jade",
    value: colorPalette.jade,
    grayValue: "sage",
  },
  teal: {
    key: "teal",
    name: "Teal",
    value: colorPalette.teal,
    grayValue: "sage",
  },
  mint: {
    key: "mint",
    name: "Mint",
    value: colorPalette.mint,
    grayValue: "sage",
  },
  cyan: {
    key: "cyan",
    name: "Cyan",
    value: colorPalette.cyan,
    grayValue: "slate",
  },
  sky: {
    key: "sky",
    name: "Sky",
    value: colorPalette.sky,
    grayValue: "slate",
  },
  blue: {
    key: "blue",
    name: "Blue",
    value: colorPalette.blue,
    grayValue: "slate",
  },
  indigo: {
    key: "indigo",
    name: "Indigo",
    value: colorPalette.indigo,
    grayValue: "slate",
  },
  iris: {
    key: "iris",
    name: "Iris",
    value: colorPalette.iris,
    grayValue: "slate",
  },
  violet: {
    key: "violet",
    name: "Violet",
    value: colorPalette.violet,
    grayValue: "mauve",
  },
  purple: {
    key: "purple",
    name: "Purple",
    value: colorPalette.purple,
    grayValue: "mauve",
  },
  plum: {
    key: "plum",
    name: "Plum",
    value: colorPalette.plum,
    grayValue: "mauve",
  },
  brown: {
    key: "brown",
    name: "Brown",
    value: colorPalette.brown,
    grayValue: "sand",
  },
  bronze: {
    key: "bronze",
    name: "Bronze",
    value: colorPalette.bronze,
    grayValue: "sand",
  },
  gold: {
    key: "gold",
    name: "Gold",
    value: colorPalette.gold,
    grayValue: "sand",
  },
  neutral: {
    key: "neutral",
    name: "Neutral",
    value: colorPalette.neutral,
    grayValue: "neutral",
  },
  mauve: {
    key: "mauve",
    name: "Mauve",
    value: colorPalette.mauve,
    grayValue: "mauve",
  },
  olive: {
    key: "olive",
    name: "Olive",
    value: colorPalette.olive,
    grayValue: "olive",
  },
  sage: {
    key: "sage",
    name: "Sage",
    value: colorPalette.sage,
    grayValue: "sage",
  },
  sand: {
    key: "sand",
    name: "Sand",
    value: colorPalette.sand,
    grayValue: "sand",
  },
  slate: {
    key: "slate",
    name: "Slate",
    value: colorPalette.slate,
    grayValue: "slate",
  },
};

type SemanticValue = {
  value: { _light: string; _dark: string };
};

type SemanticToken = SemanticValue | { [key: string]: SemanticToken };

function resolveValue(raw: string): string {
  const match = raw.match(/^\{(.+)\}$/);
  if (match) {
    return `var(--${match[1].replace(/\./g, "-")})`;
  }
  return raw;
}

function isSemanticValue(obj: unknown): obj is SemanticValue {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "value" in obj &&
    typeof (obj as SemanticValue).value === "object" &&
    "_light" in (obj as SemanticValue).value
  );
}

function flattenToken(
  token: SemanticToken,
  prefix: string,
  mode: "_light" | "_dark",
  vars: Record<string, string>,
) {
  if (isSemanticValue(token)) {
    vars[prefix] = resolveValue(token.value[mode]);
    return;
  }

  for (const [key, child] of Object.entries(token)) {
    const suffix = key === "DEFAULT" ? "" : `-${key}`;
    flattenToken(child as SemanticToken, `${prefix}${suffix}`, mode, vars);
  }
}

function varsToCSS(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([prop, val]) => `${prop}: ${val};`)
    .join("\n          ");
}

export function generateColorCSS(
  token: Record<string, SemanticToken>,
  name: string,
): string {
  const lightVars: Record<string, string> = {};
  const darkVars: Record<string, string> = {};

  flattenToken(token, `--colors-${name}`, "_light", lightVars);
  flattenToken(token, `--colors-${name}`, "_dark", darkVars);

  return `
        :where(:root, .light) {
          ${varsToCSS(lightVars)}
        }
        .dark {
          ${varsToCSS(darkVars)}
        }`;
}

function setThemeColor(token: ColorKey, name: "gray" | "primary") {
  const id = `theme-${name}`;
  const color = colorTokens[token];
  const css = generateColorCSS(color, name);
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = `@layer tokens { ${css} }`;
  } else {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@layer tokens { ${css} }`;
    document.head.appendChild(style);
  }
}

export function setColorInternal(token: ColorKey) {
  const grayToken = colors[token].grayValue;
  setThemeColor(grayToken, "gray");
  setThemeColor(token, "primary");
}
export function setColor(token: ColorKey) {
  setColorInternal(token);
  updateThemeSettings({ accentColor: token });
}

export function setModeInternal(mode: "light" | "dark") {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(mode);
}
export function setMode(mode: "light" | "dark") {
  setModeInternal(mode);
  updateThemeSettings({ mode });
}
