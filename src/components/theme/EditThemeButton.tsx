import * as Popover from "@/components/ui/popover";
import { Portal } from "@ark-ui/react";
import { PaletteIcon } from "lucide-react";

import { IconButton } from "../ui";
import { AccentColorPicker } from "./AccentColorPicker";
import { BorderRadiusPicker } from "./BorderRadiusPicker";
import { ColorModePicker } from "./ColorModePicker";
import { FontPicker } from "./FontPicker";

export function EditThemeButton() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton aria-label="Theme" variant="outline">
          <PaletteIcon />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content p={2}>
            <Popover.Arrow />
            <Popover.Body display="flex" flexDir="column" gap={6}>
              <ColorModePicker />
              <AccentColorPicker />
              <BorderRadiusPicker />
              <FontPicker />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
