import { RealmCategoriesRepository } from "@/lib/repository/realm-categories.repository";
import { useQuery } from "@tanstack/react-query";

export function useRealmCategories(realmId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["realm-categories", realmId],
    queryFn: () => RealmCategoriesRepository.getCategoriesForRealm(realmId),
  });

  return {
    categories: data,
    isLoading,
    error,
    hasLoaded: data !== undefined,
  };
}
