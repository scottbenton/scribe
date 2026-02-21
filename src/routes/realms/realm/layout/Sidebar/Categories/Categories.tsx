import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { generateKeyBetween } from "fractional-indexing";
import { PlusIcon } from "lucide-react";
import { Button, IconButton, Text } from "@/components/ui";
import { NavItem } from "@/components/NavItem";
import { useRealmCategories } from "@/hooks/useRealmCategories";
import { useUpdateRealmCategoryName } from "@/hooks/useUpdateRealmCategoryName";
import { useUpdateRealmCategoryOrder } from "@/hooks/useUpdateRealmCategoryOrder";
import { useDeleteRealmCategory } from "@/hooks/useDeleteRealmCategory";
import { type IRealmCategory } from "@/types/realm-categories.type";
import { routes } from "@/routes/routes";
import { useRealmId } from "../../../hooks/useRealmId";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { Box } from "styled-system/jsx";

interface SortableCategoryItemProps {
  category: IRealmCategory;
  realmId: string;
}

function SortableCategoryItem({
  category,
  realmId,
}: SortableCategoryItemProps) {
  const { updateName } = useUpdateRealmCategoryName(realmId);
  const { deleteCategory } = useDeleteRealmCategory(realmId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <NavItem
        label={category.name}
        href={routes.category(realmId, category.id)}
        onRename={(name) => updateName({ id: category.id, name })}
        onDelete={() => deleteCategory(category.id)}
        dragListeners={listeners}
        dragAttributes={attributes}
        isDragging={isDragging}
      />
    </div>
  );
}

export function Categories() {
  const realmId = useRealmId();
  const { categories, error } = useRealmCategories(realmId);
  const { updateOrder } = useUpdateRealmCategoryOrder(realmId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  if (error) {
    throw error;
  }

  if (!categories) {
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !categories) return;

    const activeIndex = categories.findIndex((c) => c.id === active.id);
    const overIndex = categories.findIndex((c) => c.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    // Build prev/next neighbors after the item is placed at overIndex
    const sorted = [...categories];
    const movingDown = activeIndex < overIndex;
    const prev =
      overIndex > 0 ? sorted[overIndex - (movingDown ? 0 : 1)] : null;
    const next =
      overIndex < sorted.length - 1
        ? sorted[overIndex + (movingDown ? 1 : 0)]
        : null;

    const newOrder = generateKeyBetween(
      prev?.order ?? null,
      next?.order ?? null,
    );
    updateOrder({ id: String(active.id), order: newOrder });
  }

  const categoryIds = categories.map((c) => c.id);

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

      {categories.length === 0 ? (
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
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categoryIds}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category) => (
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
