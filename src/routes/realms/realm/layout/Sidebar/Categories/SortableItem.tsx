import { NavItem } from "@/components/NavItem";
import { useDeleteRealmCategoryItem } from "@/hooks/useDeleteRealmCategoryItem";
import { useUpdateRealmCategoryItemLabel } from "@/hooks/useUpdateRealmCategoryItemLabel";
import { routes } from "@/routes/routes";
import { type IRealmCategoryItem } from "@/types/realm-category-items.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "styled-system/jsx";

interface SortableItemProps {
  item: IRealmCategoryItem;
  categoryId: string;
  realmId: string;
}

export function SortableItem(props: SortableItemProps) {
  const { item, categoryId, realmId } = props;
  const { updateLabel } = useUpdateRealmCategoryItemLabel(categoryId);
  const { deleteItem } = useDeleteRealmCategoryItem(categoryId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Box pl={4}>
        <NavItem
          label={item.label}
          defaultLabel="New Page"
          icon={item.icon}
          defaultIconType="item"
          href={routes.item(realmId, categoryId, item.id)}
          onRename={(label) => updateLabel({ id: item.id, label })}
          onDelete={() => deleteItem(item.id)}
          dragListeners={listeners}
          dragAttributes={attributes}
          isDragging={isDragging}
        />
      </Box>
    </div>
  );
}
