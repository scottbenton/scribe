import { GameIcon } from "@/components/GameIconSelector/GameIcon";
import { type IconConfig } from "@/types/icon-config.type";
import { FileText, Folder } from "lucide-react";
import { useState } from "react";

import { Icon, IconButton, IconProps } from "../ui";
import { IconPickerDialog } from "./IconPickerDialog";
import { resolveIconColor } from "./iconColors";

interface IconDisplayProps extends Omit<IconProps, "onSelect"> {
  icon: IconConfig | null;
  defaultType: "category" | "item";
  onSelect: (icon: IconConfig) => void;
}

export function IconDisplay(props: IconDisplayProps) {
  const { icon, defaultType, onSelect, ...iconProps } = props;
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <IconButton
        variant="plain"
        onClick={() => setPickerOpen(true)}
        title="Change icon"
        style={{ color: icon ? resolveIconColor(icon.color) : "currentColor" }}
      >
        {icon ? (
          <GameIcon iconKey={icon.key} {...iconProps} />
        ) : defaultType === "category" ? (
          <Icon {...iconProps}>
            <Folder />
          </Icon>
        ) : (
          <Icon>
            <FileText />
          </Icon>
        )}
      </IconButton>

      <IconPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        currentIcon={icon}
        onSelect={onSelect}
      />
    </>
  );
}
