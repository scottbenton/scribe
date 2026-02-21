import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateRealmCategoryItemLabel(categoryId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, label }: { id: string; label: string }) =>
      RealmCategoryItemsRepository.updateLabel(id, label),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["realm-category-items", categoryId],
      });
      queryClient.invalidateQueries({
        queryKey: ["realm-category-item", id],
      });
    },
  });

  return {
    updateLabel: mutate,
    isLoading: isPending,
    isError,
  };
}
