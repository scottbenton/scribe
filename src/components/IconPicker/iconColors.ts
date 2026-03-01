export enum IconColorKey {
  Primary = "primary",
  Gray = "gray",
  Contrast = "contrast",
  Brown = "brown",
  Red = "red",
  Orange = "orange",
  Yellow = "yellow",
  Green = "green",
  Teal = "teal",
  Blue = "blue",
  Purple = "purple",
  Pink = "pink",
}

export interface IconColor {
  label: string;
  key: IconColorKey;
  cssVar: string;
}

export const ICON_COLORS: IconColor[] = [
  {
    label: "Gray",
    key: IconColorKey.Gray,
    cssVar: "var(--colors-gray-11)",
  },
  {
    label: "Contrast",
    key: IconColorKey.Contrast,
    cssVar: "var(--colors-fg-default)",
  },
  {
    label: "Brown",
    key: IconColorKey.Brown,
    cssVar: "var(--colors-brown-plain-fg)",
  },
  { label: "Red", key: IconColorKey.Red, cssVar: "var(--colors-red-10)" },
  {
    label: "Orange",
    key: IconColorKey.Orange,
    cssVar: "var(--colors-orange-9)",
  },
  {
    label: "Yellow",
    key: IconColorKey.Yellow,
    cssVar: "var(--colors-yellow-8)",
  },
  {
    label: "Green",
    key: IconColorKey.Green,
    cssVar: "var(--colors-green-10)",
  },
  {
    label: "Teal",
    key: IconColorKey.Teal,
    cssVar: "var(--colors-teal-10)",
  },
  {
    label: "Blue",
    key: IconColorKey.Blue,
    cssVar: "var(--colors-blue-10)",
  },
  {
    label: "Purple",
    key: IconColorKey.Purple,
    cssVar: "var(--colors-purple-10)",
  },
  {
    label: "Pink",
    key: IconColorKey.Pink,
    cssVar: "var(--colors-pink-9)",
  },
];

const colorMap = new Map<IconColorKey, string>(
  ICON_COLORS.map((c) => [c.key, c.cssVar]),
);

export function resolveIconColor(key?: IconColorKey): string {
  if (!key) return "currentColor";
  return colorMap.get(key) ?? "currentColor";
}

export const DEFAULT_ICON_COLOR_KEY = IconColorKey.Blue;
