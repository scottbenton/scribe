import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { NavItem } from "@/components/NavItem";
import { useUpdateRealmCategoryName } from "@/hooks/useUpdateRealmCategoryName";
import { useDeleteRealmCategory } from "@/hooks/useDeleteRealmCategory";
import { type IRealmCategory } from "@/types/realm-categories.type";
import { routes } from "@/routes/routes";
import { CategoryItems } from "./CategoryItems";

interface SortableCategoryItemProps {
  category: IRealmCategory;
  realmId: string;
}

export function SortableCategoryItem(props: SortableCategoryItemProps) {
  const { category, realmId } = props;
  const { updateName } = useUpdateRealmCategoryName(realmId);
  const { deleteCategory } = useDeleteRealmCategory(realmId);
  const [addItemOpen, setAddItemOpen] = useState(false);

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
        onAdd={() => setAddItemOpen(true)}
        dragListeners={listeners}
        dragAttributes={attributes}
        isDragging={isDragging}
      />
      <CategoryItems
        categoryId={category.id}
        addItemOpen={addItemOpen}
        onAddItemOpenChange={setAddItemOpen}
      />
    </div>
  );
}
