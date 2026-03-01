import { useLocation } from "wouter";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { generateKeyBetween } from "fractional-indexing";
import { NavItem } from "@/components/NavItem";
import { useUpdateRealmCategoryName } from "@/hooks/useUpdateRealmCategoryName";
import { useDeleteRealmCategory } from "@/hooks/useDeleteRealmCategory";
import { useCreateRealmCategoryItem } from "@/hooks/useCreateRealmCategoryItem";
import { useRealmCategoryItems } from "@/hooks/useRealmCategoryItems";
import { type IRealmCategory } from "@/types/realm-categories.type";
import { routes } from "@/routes/routes";
import { CategoryItems } from "./CategoryItems";

interface SortableCategoryItemProps {
  category: IRealmCategory;
  realmId: string;
}

export function SortableCategoryItem(props: SortableCategoryItemProps) {
  const { category, realmId } = props;
  const [, navigate] = useLocation();
  const { updateName } = useUpdateRealmCategoryName(realmId);
  const { deleteCategory } = useDeleteRealmCategory(realmId);
  const { createItem } = useCreateRealmCategoryItem(category.id);
  const { items } = useRealmCategoryItems(category.id);

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

  function handleAddItem() {
    const maxOrder = items?.reduce<string | null>(
      (max, item) => (max === null || item.order > max ? item.order : max),
      null,
    ) ?? null;
    const order = generateKeyBetween(maxOrder, null);
    createItem({ order }, {
      onSuccess: (newItem) => {
        navigate(routes.item(realmId, category.id, newItem.id));
      },
    });
  }

  return (
    <div ref={setNodeRef} style={style}>
      <NavItem
        label={category.label}
        defaultLabel="New Category"
        icon={category.icon}
        defaultIconType="category"
        href={routes.category(realmId, category.id)}
        onRename={(name) => updateName({ id: category.id, name })}
        onDelete={() => deleteCategory(category.id)}
        onAdd={handleAddItem}
        dragListeners={listeners}
        dragAttributes={attributes}
        isDragging={isDragging}
      />
      <CategoryItems categoryId={category.id} />
    </div>
  );
}
