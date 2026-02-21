import { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { generateKeyBetween } from "fractional-indexing";
import { PlusIcon } from "lucide-react";
import { Button, IconButton, Text } from "@/components/ui";
import { useRealmCategories } from "@/hooks/useRealmCategories";
import { useUpdateRealmCategoryOrder } from "@/hooks/useUpdateRealmCategoryOrder";
import { useRealmId } from "../../../hooks/useRealmId";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { SortableCategoryItem } from "./SortableCategoryItem";
import { type IRealmCategory } from "@/types/realm-categories.type";
import { Box } from "styled-system/jsx";

export function Categories() {
  const realmId = useRealmId();
  const { categories, error } = useRealmCategories(realmId);
  const { updateOrder } = useUpdateRealmCategoryOrder(realmId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState<IRealmCategory[]>([]);

  useEffect(() => {
    if (categories) {
      setLocalCategories(categories);
    }
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  if (error) {
    throw error;
  }

  const categoryIds = useMemo(
    () => localCategories.map((c) => c.id),
    [localCategories],
  );

  if (!categories) {
    return null;
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalCategories((items) => {
      const activeIndex = items.findIndex((c) => c.id === active.id);
      const overIndex = items.findIndex((c) => c.id === over.id);
      if (activeIndex === -1 || overIndex === -1) return items;
      return arrayMove(items, activeIndex, overIndex);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = localCategories.findIndex((c) => c.id === active.id);
    const overIndex = localCategories.findIndex((c) => c.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    const moved = arrayMove(localCategories, activeIndex, overIndex);
    const movedIndex = moved.findIndex((c) => c.id === active.id);
    const prev = movedIndex > 0 ? moved[movedIndex - 1] : null;
    const next = movedIndex < moved.length - 1 ? moved[movedIndex + 1] : null;

    const newOrder = generateKeyBetween(
      prev?.order ?? null,
      next?.order ?? null,
    );
    updateOrder({ id: String(active.id), order: newOrder });
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1}
      >
        <Text fontWeight="semibold" textStyle="sm" color="fg.muted">
          Categories
        </Text>
        <IconButton
          size="xs"
          variant="plain"
          aria-label="Add category"
          onClick={() => setDialogOpen(true)}
        >
          <PlusIcon size={14} />
        </IconButton>
      </Box>

      {localCategories.length === 0 ? (
        <Box
          display="flex"
          flexDir="column"
          alignItems="center"
          gap={2}
          py={4}
          px={2}
        >
          <Text textStyle="sm" color="fg.muted">
            No categories yet
          </Text>
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            Create category
          </Button>
        </Box>
      ) : (
        <DndContext
          id="categories-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categoryIds}
            strategy={verticalListSortingStrategy}
          >
            {localCategories.map((category) => (
              <SortableCategoryItem
                key={category.id}
                category={category}
                realmId={realmId}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <CreateCategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
