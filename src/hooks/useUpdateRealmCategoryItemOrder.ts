import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IRealmCategoryItem } from "@/types/realm-category-items.type";

import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";

export function useUpdateRealmCategoryItemOrder(categoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["realm-category-items", categoryId];

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, order }: { id: string; order: string }) =>
      RealmCategoryItemsRepository.updateOrder(id, order),

    onMutate: async ({ id, order }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<IRealmCategoryItem[]>(queryKey);

      queryClient.setQueryData<IRealmCategoryItem[]>(queryKey, (old) =>
        old
          ? [...old]
              .map((item) => (item.id === id ? { ...item, order } : item))
              .sort((a, b) => (a.order < b.order ? -1 : 1))
          : old,
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    updateOrder: mutate,
    isLoading: isPending,
    isError,
  };
}
