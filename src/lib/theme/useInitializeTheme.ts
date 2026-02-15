import { useEffect } from "react";
import { getThemeSettings } from "./storage.lib";
import { setColorInternal, setModeInternal } from "./colors.lib";
import { setFontInternal } from "./fonts.lib";
import { setRadiusInternal } from "./radius.lib";

export function useInitializeTheme() {
  useEffect(() => {
    const theme = getThemeSettings();

    setColorInternal(theme.accentColor);
    setModeInternal(theme.mode);
    setFontInternal(theme.font);
    setRadiusInternal(theme.radius);
  }, []);
}
