import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui";
import * as Editable from "@/components/ui/editable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useRealmCategories } from "@/hooks/useRealmCategories";
import { useUpdateRealmCategoryName } from "@/hooks/useUpdateRealmCategoryName";
import { useDeleteRealmCategory } from "@/hooks/useDeleteRealmCategory";
import { useRealmId } from "../hooks/useRealmId";
import { routes } from "@/routes/routes";
import { Box } from "styled-system/jsx";
import { css } from "styled-system/css";

export function CategoryPage() {
  const realmId = useRealmId();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [, navigate] = useLocation();

  const { categories } = useRealmCategories(realmId);
  const { updateName } = useUpdateRealmCategoryName(realmId);
  const { deleteCategory } = useDeleteRealmCategory(realmId);

  const category = categories?.find((c) => c.id === categoryId);

  const [nameValue, setNameValue] = useState(category?.name ?? "");

  // Sync when the category name changes externally (e.g. renamed from sidebar)
  useEffect(() => {
    if (category?.name !== undefined) {
      setNameValue(category.name);
    }
  }, [category?.name]);

  if (!category) {
    return null;
  }

  function handleNameCommit(value: string) {
    const trimmed = value.trim();
    if (trimmed && trimmed !== category!.name) {
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
      <Box display="flex" alignItems="center" justifyContent="space-between">
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

        <ConfirmDialog
          title={`Delete "${category.name}"?`}
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
