import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button, Text } from "@/components/ui";
import * as Editable from "@/components/ui/editable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useRealmCategoryItem } from "@/hooks/useRealmCategoryItem";
import { useUpdateRealmCategoryItemLabel } from "@/hooks/useUpdateRealmCategoryItemLabel";
import { useDeleteRealmCategoryItem } from "@/hooks/useDeleteRealmCategoryItem";
import { useRealmId } from "../../hooks/useRealmId";
import { routes } from "@/routes/routes";
import { Box } from "styled-system/jsx";
import { css } from "styled-system/css";

export function ItemPage() {
  const realmId = useRealmId();
  const { categoryId, itemId } = useParams<{
    categoryId: string;
    itemId: string;
  }>();
  const [, navigate] = useLocation();

  const { item } = useRealmCategoryItem(itemId);
  const { updateLabel } = useUpdateRealmCategoryItemLabel(categoryId);
  const { deleteItem } = useDeleteRealmCategoryItem(categoryId);

  const [labelValue, setLabelValue] = useState(item?.label ?? "");

  useEffect(() => {
    if (item?.label !== undefined) {
      setLabelValue(item.label);
    }
  }, [item?.label]);

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
    <Box p={6} display="flex" flexDir="column" gap={4} w="full" key={itemId}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
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
                p: 0,
              })}
            />
            <Editable.Preview
              className={css({
                fontSize: "2xl",
                fontWeight: "semibold",
                cursor: "text",
              })}
            />
          </Editable.Area>
        </Editable.Root>

        <ConfirmDialog
          title={`Delete "${item.label}"?`}
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

      <Box>
        <Text color="fg.muted" textStyle="sm">
          Notes editor coming soon
        </Text>
      </Box>
    </Box>
  );
}
