import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { RealmCategoriesRepository } from "@/lib/repository/realm-categories.repository";

export function useRealmCategories(realmId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["realm-categories", realmId],
    queryFn: () => RealmCategoriesRepository.getCategoriesForRealm(realmId),
  });

  const categories = useMemo(
    () =>
      data
        ? [...data].sort((a, b) =>
            a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
          )
        : undefined,
    [data],
  );

  return {
    categories,
    isLoading,
    error,
    hasLoaded: data !== undefined,
  };
}
