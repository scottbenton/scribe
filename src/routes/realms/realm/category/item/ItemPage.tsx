import { type JSONContent } from "@tiptap/core";
import { useCallback, useEffect, useState } from "react";
import { css } from "styled-system/css";
import { Box } from "styled-system/jsx";
import { useLocation, useParams } from "wouter";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { IconDisplay } from "@/components/IconPicker";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui";
import * as Editable from "@/components/ui/editable";

import { routes } from "@/routes/routes";

import { useDeleteRealmCategoryItem } from "@/hooks/useDeleteRealmCategoryItem";
import { useRealmCategoryItem } from "@/hooks/useRealmCategoryItem";
import { useUpdateRealmCategoryItemIcon } from "@/hooks/useUpdateRealmCategoryItemIcon";
import { useUpdateRealmCategoryItemLabel } from "@/hooks/useUpdateRealmCategoryItemLabel";
import { useUpdateRealmCategoryItemNotesText } from "@/hooks/useUpdateRealmCategoryItemNotesText";

import { useRealmId } from "../../hooks/useRealmId";

export function ItemPage() {
  const realmId = useRealmId();
  const { categoryId, itemId } = useParams<{
    categoryId: string;
    itemId: string;
  }>();
  const [, navigate] = useLocation();

  const { item } = useRealmCategoryItem(itemId);
  const { updateLabel } = useUpdateRealmCategoryItemLabel(categoryId);
  const { updateIcon } = useUpdateRealmCategoryItemIcon(categoryId);
  const { updateNotesText } = useUpdateRealmCategoryItemNotesText(itemId);
  const { deleteItem } = useDeleteRealmCategoryItem(categoryId);

  const [labelValue, setLabelValue] = useState(item?.label ?? "");

  useEffect(() => {
    if (item?.label !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLabelValue(item.label);
    }
  }, [item?.label]);

  const handleSave = useCallback(
    (content: JSONContent, text: string) => {
      updateNotesText({ notes: content, notesText: text });
    },
    [updateNotesText],
  );

  if (!item) {
    return null;
  }

  function handleLabelCommit(value: string) {
    const trimmed = value.trim();
    if (trimmed && trimmed !== item!.label) {
      updateLabel({ id: item!.id, label: trimmed });
    }
  }

  function handleDelete() {
    deleteItem(item!.id, {
      onSuccess: () => navigate(routes.category(realmId, categoryId)),
    });
  }

  return (
    <Box
      p={6}
      pb={0}
      display="flex"
      flexDir="column"
      flexGrow={1}
      gap={4}
      w="full"
      key={itemId}
      bg="gray.surface.bg"
    >
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" flex={1} minW={0}>
          <IconDisplay
            icon={item.icon}
            defaultType="item"
            onSelect={(icon) => updateIcon({ id: item.id, icon })}
          />
          <Editable.Root
            value={labelValue}
            onValueChange={(details) => setLabelValue(details.value)}
            activationMode="dblclick"
            onValueCommit={(details) => handleLabelCommit(details.value)}
          >
            <Editable.Area>
              <Editable.Input
                className={css({
                  fontSize: "2xl",
                  fontWeight: "semibold",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  px: 2,
                  py: 0,
                })}
              />
              <Editable.Preview
                className={css({
                  px: 2,
                  fontSize: "2xl",
                  fontWeight: "semibold",
                  cursor: "text",
                })}
              />
            </Editable.Area>
          </Editable.Root>
        </Box>

        <ConfirmDialog
          title={`Delete "${item.label ?? "New Page"}"?`}
          description="This will permanently delete the item and cannot be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={handleDelete}
          trigger={
            <Button variant="outline" colorPalette="red" size="sm">
              Delete
            </Button>
          }
        />
      </Box>

      <RichTextEditor
        key={itemId}
        itemId={itemId}
        initialContent={item.notesText}
        onSave={handleSave}
        realmId={realmId}
      />
    </Box>
  );
}
