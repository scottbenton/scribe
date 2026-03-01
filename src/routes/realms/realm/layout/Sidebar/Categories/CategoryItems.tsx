import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { generateKeyBetween } from "fractional-indexing";
import { useEffect, useMemo, useState } from "react";

import { type IRealmCategoryItem } from "@/types/realm-category-items.type";

import { useRealmCategoryItems } from "@/hooks/useRealmCategoryItems";
import { useUpdateRealmCategoryItemOrder } from "@/hooks/useUpdateRealmCategoryItemOrder";

import { useRealmId } from "../../../hooks/useRealmId";
import { SortableItem } from "./SortableItem";

interface CategoryItemsProps {
  categoryId: string;
}

export function CategoryItems(props: CategoryItemsProps) {
  const { categoryId } = props;
  const realmId = useRealmId();
  const { items } = useRealmCategoryItems(categoryId);
  const { updateOrder } = useUpdateRealmCategoryItemOrder(categoryId);
  const [localItems, setLocalItems] = useState<IRealmCategoryItem[]>([]);

  useEffect(() => {
    if (items) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalItems(items);
    }
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const itemIds = useMemo(() => localItems.map((i) => i.id), [localItems]);

  if (!items) {
    return null;
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalItems((current) => {
      const activeIndex = current.findIndex((i) => i.id === active.id);
      const overIndex = current.findIndex((i) => i.id === over.id);
      if (activeIndex === -1 || overIndex === -1) return current;
      return arrayMove(current, activeIndex, overIndex);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = localItems.findIndex((i) => i.id === active.id);
    const overIndex = localItems.findIndex((i) => i.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    const moved = arrayMove(localItems, activeIndex, overIndex);
    const movedIndex = moved.findIndex((i) => i.id === active.id);
    const prev = movedIndex > 0 ? moved[movedIndex - 1] : null;
    const next = movedIndex < moved.length - 1 ? moved[movedIndex + 1] : null;

    const newOrder = generateKeyBetween(
      prev?.order ?? null,
      next?.order ?? null,
    );
    updateOrder({ id: String(active.id), order: newOrder });
  }

  return (
    <DndContext
      id={`category-items-dnd-${categoryId}`}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {localItems.map((item) => (
          <SortableItem
            key={item.id}
            item={item}
            categoryId={categoryId}
            realmId={realmId}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
