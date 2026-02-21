import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteRealmCategoryItem(categoryId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (id: string) => RealmCategoryItemsRepository.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["realm-category-items", categoryId],
      });
    },
  });

  return {
    deleteItem: mutate,
    isLoading: isPending,
    isError,
  };
}
