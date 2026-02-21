import { RealmCategoriesRepository } from "@/lib/repository/realm-categories.repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteRealmCategory(realmId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (id: string) => RealmCategoriesRepository.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realm-categories", realmId] });
    },
  });

  return {
    deleteCategory: mutate,
    isLoading: isPending,
    isError,
  };
}
