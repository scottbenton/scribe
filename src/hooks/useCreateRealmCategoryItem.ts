import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateRealmCategoryItem(categoryId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ order }: { order: string }) =>
      RealmCategoryItemsRepository.createItem(categoryId, order),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["realm-category-items", categoryId],
      });
    },
  });

  return {
    createItem: mutate,
    isLoading: isPending,
    isError,
  };
}
