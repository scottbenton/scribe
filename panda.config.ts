import { defineConfig } from "@pandacss/dev";

import { animationStyles } from "@/theme/animation-styles";
import * as colorPalette from "@/theme/colors";
import { conditions } from "@/theme/conditions";
import { globalCss } from "@/theme/global-css";
import { keyframes } from "@/theme/keyframes";
import { layerStyles } from "@/theme/layer-styles";
import { recipes, slotRecipes } from "@/theme/recipes";
import { textStyles } from "@/theme/text-styles";
import { colors } from "@/theme/tokens/colors";
import { durations } from "@/theme/tokens/durations";
import { shadows } from "@/theme/tokens/shadows";
import { zIndex } from "@/theme/tokens/z-index";

const semanticColors = {
  fg: {
    default: {
      value: {
        _light: "{colors.gray.12}",
        _dark: "{colors.gray.12}",
      },
    },

    muted: {
      value: {
        _light: "{colors.gray.11}",
        _dark: "{colors.gray.11}",
      },
    },

    subtle: {
      value: {
        _light: "{colors.gray.10}",
        _dark: "{colors.gray.10}",
      },
    },
  },

  border: {
    value: {
      _light: "{colors.gray.4}",
      _dark: "{colors.gray.4}",
    },
  },

  error: {
    value: {
      _light: "{colors.red.9}",
      _dark: "{colors.red.9}",
    },
  },

  ...colorPalette,
  primary: colorPalette.neutral,
  gray: colorPalette.neutral,
};

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  jsxFramework: "react",

  // Useful for theme customization
  theme: {
    extend: {
      animationStyles: animationStyles,
      recipes: recipes,
      slotRecipes: slotRecipes,
      keyframes: keyframes,
      layerStyles: layerStyles,
      textStyles: textStyles,

      tokens: {
        colors: colors,
        durations: durations,
        zIndex: zIndex,
      },

      semanticTokens: {
        colors: semanticColors,

        shadows: shadows,

        radii: {
          l1: {
            value: "{radii.md}",
          },

          l2: {
            value: "{radii.lg}",
          },

          l3: {
            value: "{radii.xl}",
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  globalCss: globalCss,
  conditions: conditions,
});
