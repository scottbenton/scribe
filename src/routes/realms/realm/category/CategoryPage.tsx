import { useEffect, useState } from "react";
import { css } from "styled-system/css";
import { Box } from "styled-system/jsx";
import { useLocation, useParams } from "wouter";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { IconDisplay } from "@/components/IconPicker";
import { Button } from "@/components/ui";
import * as Editable from "@/components/ui/editable";

import { routes } from "@/routes/routes";

import { useDeleteRealmCategory } from "@/hooks/useDeleteRealmCategory";
import { useRealmCategories } from "@/hooks/useRealmCategories";
import { useUpdateRealmCategoryIcon } from "@/hooks/useUpdateRealmCategoryIcon";
import { useUpdateRealmCategoryName } from "@/hooks/useUpdateRealmCategoryName";

import { useRealmId } from "../hooks/useRealmId";

export function CategoryPage() {
  const realmId = useRealmId();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [, navigate] = useLocation();

  const { categories } = useRealmCategories(realmId);
  const { updateName } = useUpdateRealmCategoryName(realmId);
  const { updateIcon } = useUpdateRealmCategoryIcon(realmId);
  const { deleteCategory } = useDeleteRealmCategory(realmId);

  const category = categories?.find((c) => c.id === categoryId);

  const [nameValue, setNameValue] = useState(category?.label ?? "");

  // Sync when the category name changes externally (e.g. renamed from sidebar)
  useEffect(() => {
    if (category?.label !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNameValue(category.label);
    }
  }, [category?.label]);

  if (!category) {
    return null;
  }

  function handleNameCommit(value: string) {
    const trimmed = value.trim();
    if (trimmed && trimmed !== category!.label) {
      updateName({ id: category!.id, name: trimmed });
    }
  }

  function handleDelete() {
    deleteCategory(category!.id, {
      onSuccess: () => navigate(routes.realm(realmId)),
    });
  }

  return (
    <Box
      p={6}
      display="flex"
      flexDir="column"
      gap={4}
      w="full"
      key={categoryId}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" gap={3} flex={1} minW={0}>
          <IconDisplay
            icon={category.icon}
            defaultType="category"
            onSelect={(icon) => updateIcon({ id: category.id, icon })}
          />
          <Editable.Root
            value={nameValue}
            onValueChange={(details) => setNameValue(details.value)}
            activationMode="dblclick"
            onValueCommit={(details) => handleNameCommit(details.value)}
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
        </Box>

        <ConfirmDialog
          title={`Delete "${category.label ?? "New Category"}"?`}
          description="This will permanently delete the category and cannot be undone."
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
    </Box>
  );
}
