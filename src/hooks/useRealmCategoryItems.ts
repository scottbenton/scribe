import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";

export function useRealmCategoryItems(categoryId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["realm-category-items", categoryId],
    queryFn: () => RealmCategoryItemsRepository.getAllInCategory(categoryId),
  });

  const items = useMemo(
    () =>
      data
        ? [...data].sort((a, b) =>
            a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
          )
        : undefined,
    [data],
  );

  return {
    items,
    isLoading,
    error,
    hasLoaded: data !== undefined,
  };
}
