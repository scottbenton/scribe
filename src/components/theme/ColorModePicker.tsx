import { getThemeSettings, setMode } from "@/lib/theme";
import { useState } from "react";
import { ButtonGroup, IconButton, ToggleGroup } from "../ui";
import { MoonIcon, SunIcon } from "lucide-react";

export function ColorModePicker() {
  const [colorMode, setColorMode] = useState(getThemeSettings().mode);

  const handleColorModeChange = (newMode: "light" | "dark") => {
    setColorMode(newMode);
    setMode(newMode);
  };

  return (
    <ToggleGroup.Root
      aria-label="Color mode"
      value={colorMode ? [colorMode] : []}
      onValueChange={(e) => {
        if (e.value.length > 0) {
          handleColorModeChange(e.value[0] as "light" | "dark");
        }
      }}
      asChild
    >
      <ButtonGroup
        variant="outline"
        attached
        colorPalette={"primary"}
        style={{ gap: 0 }}
      >
        <ToggleGroup.Item value="light" asChild>
          <IconButton aria-label="Light mode">
            <SunIcon />
          </IconButton>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="dark" asChild>
          <IconButton aria-label="Dark mode">
            <MoonIcon />
          </IconButton>
        </ToggleGroup.Item>
      </ButtonGroup>
    </ToggleGroup.Root>
  );
}
