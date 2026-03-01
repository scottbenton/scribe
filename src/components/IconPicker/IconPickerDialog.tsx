import { Portal } from "@ark-ui/react/portal";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { css } from "styled-system/css";
import { Box } from "styled-system/jsx";

import { GameIconList } from "@/components/GameIconSelector/GameIconList";
import { Field, IconButton, Input } from "@/components/ui";
import * as Dialog from "@/components/ui/dialog";

import { type IconConfig } from "@/types/icon-config.type";

import {
  DEFAULT_ICON_COLOR_KEY,
  ICON_COLORS,
  IconColorKey,
  resolveIconColor,
} from "./iconColors";

interface IconPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIcon: IconConfig | null;
  onSelect: (icon: IconConfig) => void;
}

export function IconPickerDialog(props: IconPickerDialogProps) {
  const { open, onOpenChange, currentIcon, onSelect } = props;
  const [search, setSearch] = useState("");
  const [selectedColorKey, setSelectedColorKey] = useState<IconColorKey>(
    currentIcon?.color ?? DEFAULT_ICON_COLOR_KEY,
  );

  function handleIconSelect(key: string) {
    onSelect({ type: "game_icon", key, color: selectedColorKey });
    onOpenChange(false);
    setSearch("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) setSearch("");
    onOpenChange(next);
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open }) => handleOpenChange(open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="600px"
            display="flex"
            flexDir="column"
            h="560px"
          >
            <Dialog.Header>
              <Dialog.Title>Select Icon</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <IconButton variant="plain">
                  <XIcon />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body
              display="flex"
              flexDir="column"
              flex="1"
              minH="0"
              gap={3}
            >
              {/* Color swatches */}
              <Box display="flex" gap={2} flexWrap="wrap">
                {ICON_COLORS.map((color) => (
                  <Box
                    key={color.key}
                    as="button"
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    cursor="pointer"
                    title={color.label}
                    style={{ backgroundColor: resolveIconColor(color.key) }}
                    outline={
                      selectedColorKey === color.key ? "2px solid" : "none"
                    }
                    outlineColor="fg.default"
                    outlineOffset="2px"
                    onClick={() => setSelectedColorKey(color.key)}
                    className={css({ flexShrink: 0 })}
                  />
                ))}
              </Box>

              {/* Search */}
              <Field.Root>
                <Input
                  placeholder="Search icons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Field.Root>

              {/* Icon grid */}
              <GameIconList
                search={search}
                onSelect={handleIconSelect}
                color={selectedColorKey}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
