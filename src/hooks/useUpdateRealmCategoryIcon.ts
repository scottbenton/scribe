import { RealmCategoriesRepository } from "@/lib/repository/realm-categories.repository";
import { type IconConfig } from "@/types/icon-config.type";
import { type IRealmCategory } from "@/types/realm-categories.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateRealmCategoryIcon(realmId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["realm-categories", realmId];

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, icon }: { id: string; icon: IconConfig | null }) =>
      RealmCategoriesRepository.updateIcon(id, icon),

    onMutate: async ({ id, icon }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<IRealmCategory[]>(queryKey);
      queryClient.setQueryData<IRealmCategory[]>(queryKey, (old) =>
        old ? old.map((c) => (c.id === id ? { ...c, icon } : c)) : old,
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
    updateIcon: mutate,
    isLoading: isPending,
    isError,
  };
}
