import { ColorKey, colorTokens } from "./colors.lib";
import { FontVariable, fontMap } from "./fonts.lib";
import { Radius, radii } from "./radius.lib";

export type ThemeSettings = {
  accentColor: ColorKey;
  radius: Radius;
  font: FontVariable;
  mode: "light" | "dark";
};

const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  accentColor: "neutral",
  radius: "md",
  font: "font-inter",
  mode: "light",
};

const LOCAL_STORAGE_KEY = "theme-settings";

export function getThemeSettings(): ThemeSettings {
  let settings = { ...DEFAULT_THEME_SETTINGS };

  const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (localStorageValue) {
    try {
      const parsedSettings = JSON.parse(localStorageValue);
      if (!parsedSettings || typeof parsedSettings !== "object") {
        throw new Error("Invalid theme settings format");
      }
      const parsedAccentColor = parsedSettings.accentColor;
      const parsedRadius = parsedSettings.radius;
      const parsedFont = parsedSettings.font;
      const parsedMode = parsedSettings.mode;

      if (colorTokens.hasOwnProperty(parsedAccentColor)) {
        settings.accentColor = parsedAccentColor;
      }
      if (radii.hasOwnProperty(parsedRadius)) {
        settings.radius = parsedRadius;
      }
      if (fontMap.hasOwnProperty(parsedFont)) {
        settings.font = parsedFont;
      }
      if (parsedMode === "light" || parsedMode === "dark") {
        settings.mode = parsedMode;
      }
    } catch (error) {
      console.error("Error parsing theme settings from localStorage:", error);
    }
  }

  return settings;
}

export function updateThemeSettings(settings: Partial<ThemeSettings>): void {
  const updatedSettings = { ...getThemeSettings(), ...settings };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSettings));
}
