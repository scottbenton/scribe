import { updateThemeSettings } from "./storage.lib";

export type Radius = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export const radii: Record<
  Radius,
  {
    label: string;
    l3: string;
    l2: string;
    l1: string;
  }
> = {
  none: {
    label: "None",
    l3: "none",
    l2: "none",
    l1: "none",
  },
  xs: {
    label: "Extra Small",
    l3: "2xs",
    l2: "xs",
    l1: "sm",
  },
  sm: {
    label: "Small",
    l3: "xs",
    l2: "sm",
    l1: "md",
  },
  md: {
    label: "Medium-Small",
    l3: "sm",
    l2: "md",
    l1: "lg",
  },
  lg: {
    label: "Medium",
    l3: "md",
    l2: "lg",
    l1: "xl",
  },
  xl: {
    label: "Medium-Large",
    l3: "lg",
    l2: "xl",
    l1: "2xl",
  },
  "2xl": {
    label: "Large",
    l3: "xl",
    l2: "2xl",
    l1: "3xl",
  },
};

export const visibleRadii: Radius[] = ["none", "sm", "lg", "2xl"];

export function setRadiusInternal(radius: Radius) {
  const { l3, l2, l1 } = radii[radius];
  document.body.style.setProperty("--radii-l3", `var(--radii-${l3})`);
  document.body.style.setProperty("--radii-l2", `var(--radii-${l2})`);
  document.body.style.setProperty("--radii-l1", `var(--radii-${l1})`);
}

export function setRadius(radius: Radius) {
  setRadiusInternal(radius);
  updateThemeSettings({ radius });
}
