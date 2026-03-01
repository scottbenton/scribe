import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type IconConfig } from "@/types/icon-config.type";
import { type IRealmCategoryItem } from "@/types/realm-category-items.type";

import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";

export function useUpdateRealmCategoryItemIcon(categoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["realm-category-items", categoryId];

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, icon }: { id: string; icon: IconConfig | null }) =>
      RealmCategoryItemsRepository.updateIcon(id, icon),

    onMutate: async ({ id, icon }) => {
      const itemQueryKey = ["realm-category-item", id];
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: itemQueryKey });
      const previous = queryClient.getQueryData<IRealmCategoryItem[]>(queryKey);
      const previousItem = queryClient.getQueryData(itemQueryKey);
      queryClient.setQueryData<IRealmCategoryItem[]>(queryKey, (old) =>
        old ? old.map((i) => (i.id === id ? { ...i, icon } : i)) : old,
      );
      queryClient.setQueryData(itemQueryKey, (old) =>
        old ? { ...old, icon } : old,
      );
      return { previous, previousItem, itemQueryKey };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      if (context?.itemQueryKey) {
        queryClient.setQueryData(context.itemQueryKey, context.previousItem);
      }
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["realm-category-item", id] });
    },
  });

  return {
    updateIcon: mutate,
    isLoading: isPending,
    isError,
  };
}
