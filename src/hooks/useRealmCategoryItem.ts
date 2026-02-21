import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";
import { useQuery } from "@tanstack/react-query";

export function useRealmCategoryItem(itemId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["realm-category-item", itemId],
    queryFn: () => RealmCategoryItemsRepository.getItem(itemId),
  });

  return {
    item: data,
    isLoading,
    error,
  };
}
