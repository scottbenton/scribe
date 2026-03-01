import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IRealmCategory } from "@/types/realm-categories.type";

import { RealmCategoriesRepository } from "@/lib/repository/realm-categories.repository";

export function useUpdateRealmCategoryOrder(realmId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["realm-categories", realmId];

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, order }: { id: string; order: string }) =>
      RealmCategoriesRepository.updateOrder(id, order),

    onMutate: async ({ id, order }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<IRealmCategory[]>(queryKey);

      queryClient.setQueryData<IRealmCategory[]>(queryKey, (old) =>
        old
          ? [...old]
              .map((c) => (c.id === id ? { ...c, order } : c))
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
