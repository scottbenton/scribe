import { useQuery } from "@tanstack/react-query";

import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";

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
