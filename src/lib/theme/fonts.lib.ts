import { updateThemeSettings } from "./storage.lib";

export type FontVariable =
  | "font-inter"
  | "font-rubik"
  | "font-lora"
  | "font-newsreader"
  | "font-ibm-plex-serif"
  | "font-vollkorn"
  | "font-bitter"
  | "font-im-fell-english"
  | "font-orbitron"
  | "font-exo-2"
  | "font-rajdhani"
  | "font-space-mono"
  | "font-ibm-plex-mono";

export type FontOption = {
  name: string;
  variable: FontVariable;
};

export type FontGroup = {
  label: string;
  fonts: FontOption[];
};

export const fontGroups: FontGroup[] = [
  {
    label: "Clean",
    fonts: [
      { name: "Inter", variable: "font-inter" },
      { name: "Rubik", variable: "font-rubik" },
      { name: "Lora", variable: "font-lora" },
      { name: "Newsreader", variable: "font-newsreader" },
      { name: "IBM Plex Serif", variable: "font-ibm-plex-serif" },
    ],
  },
  {
    label: "Fantasy",
    fonts: [
      { name: "Vollkorn", variable: "font-vollkorn" },
      { name: "Bitter", variable: "font-bitter" },
      { name: "IM Fell English", variable: "font-im-fell-english" },
    ],
  },
  {
    label: "Space age",
    fonts: [
      { name: "Orbitron", variable: "font-orbitron" },
      { name: "Exo 2", variable: "font-exo-2" },
      { name: "Rajdhani", variable: "font-rajdhani" },
    ],
  },
  {
    label: "Terminal",
    fonts: [
      { name: "Space Mono", variable: "font-space-mono" },
      { name: "IBM Plex Mono", variable: "font-ibm-plex-mono" },
    ],
  },
];

export const allFontItems = fontGroups.flatMap((group) =>
  group.fonts.map((font) => ({
    label: font.name,
    variable: font.variable,
    group: group.label,
  })),
);

export const fontMap: Record<string, FontOption> = Object.fromEntries(
  allFontItems.map((font) => [
    font.variable,
    {
      name: font.label,
      variable: font.variable,
    },
  ]),
);

fontGroups.reduce(
  (acc, group) => ({
    ...acc,
    ...group.fonts.reduce(
      (acc, font) => ({ ...acc, [font.variable]: font }),
      {},
    ),
  }),
  {},
);

export function setFontInternal(font: FontVariable) {
  const fontOption = fontMap[font];
  if (!fontOption) return;
  const { variable } = fontOption;
  document.body.style.setProperty("--font-active", `var(--${variable})`);
}

export function setFont(font: FontVariable) {
  const fontOption = fontMap[font];
  if (!fontOption) return;

  setFontInternal(font);
  updateThemeSettings({ font });
}
