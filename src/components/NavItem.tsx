import { useState } from "react";
import { Link } from "wouter";
import { GripVertical } from "lucide-react";
import { Portal } from "@ark-ui/react/portal";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { DraggableAttributes } from "@dnd-kit/core";
import * as Editable from "@/components/ui/editable";
import * as Menu from "@/components/ui/menu";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { css } from "styled-system/css";
import { Box } from "styled-system/jsx";

export interface NavItemContextMenuItem {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
}

export interface NavItemProps {
  label: string;
  href: string;
  onRename: (newName: string) => void;
  onDelete: () => void;
  contextMenuItems?: NavItemContextMenuItem[];
  dragListeners?: SyntheticListenerMap;
  dragAttributes?: DraggableAttributes;
  isDragging?: boolean;
}

export function NavItem({
  label,
  href,
  onRename,
  onDelete,
  contextMenuItems = [],
  dragListeners,
  dragAttributes,
  isDragging = false,
}: NavItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleRenameCommit(value: string) {
    const trimmed = value.trim();
    if (trimmed && trimmed !== label) {
      onRename(trimmed);
    }
    setIsRenaming(false);
  }

  return (
    <>
      <Menu.Root>
        <Menu.ContextTrigger asChild>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            px={2}
            py={1}
            borderRadius="sm"
            opacity={isDragging ? 0.5 : 1}
            _hover={{ bg: "bg.subtle" }}
            className={css({
              "& .drag-handle": { opacity: 0 },
              "&:hover .drag-handle": { opacity: 1 },
            })}
          >
            {/* Drag handle */}
            <Box
              className="drag-handle"
              display="flex"
              alignItems="center"
              cursor="grab"
              color="fg.subtle"
              flexShrink={0}
              {...dragListeners}
              {...dragAttributes}
            >
              <GripVertical size={14} />
            </Box>

            {/* Inline rename or link */}
            {isRenaming ? (
              <Box flex={1}>
                <Editable.Root
                  defaultValue={label}
                  autoResize
                  activationMode="focus"
                  defaultEdit
                  onValueCommit={(details) => handleRenameCommit(details.value)}
                  onValueRevert={() => setIsRenaming(false)}
                >
                  <Editable.Area>
                    <Editable.Input
                      autoFocus
                      className={css({ width: "full", fontSize: "sm" })}
                    />
                    <Editable.Preview />
                  </Editable.Area>
                </Editable.Root>
              </Box>
            ) : (
              <Link
                href={href}
                className={css({
                  flex: 1,
                  fontSize: "sm",
                  color: "fg.default",
                  textDecoration: "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                })}
              >
                {label}
              </Link>
            )}
          </Box>
        </Menu.ContextTrigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
            <Menu.Item value="rename" onSelect={() => setIsRenaming(true)}>
              <Menu.ItemText>Rename</Menu.ItemText>
            </Menu.Item>
            {contextMenuItems.map((item) => (
              <Menu.Item
                key={item.label}
                value={item.label}
                onSelect={item.onSelect}
                className={
                  item.destructive ? css({ color: "red.500" }) : undefined
                }
              >
                <Menu.ItemText>{item.label}</Menu.ItemText>
              </Menu.Item>
            ))}
            <Menu.Separator />
            <Menu.Item
              value="delete"
              onSelect={() => setDeleteOpen(true)}
              className={css({ color: "red.500" })}
            >
              <Menu.ItemText>Delete</Menu.ItemText>
            </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${label}"?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          onDelete();
          setDeleteOpen(false);
        }}
      />
    </>
  );
}
