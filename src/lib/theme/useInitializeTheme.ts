import { useEffect } from "react";

import { setColorInternal, setModeInternal } from "./colors.lib";
import { setFontInternal } from "./fonts.lib";
import { setRadiusInternal } from "./radius.lib";
import { getThemeSettings } from "./storage.lib";

export function useInitializeTheme() {
  useEffect(() => {
    const theme = getThemeSettings();

    setColorInternal(theme.accentColor);
    setModeInternal(theme.mode);
    setFontInternal(theme.font);
    setRadiusInternal(theme.radius);
  }, []);
}
