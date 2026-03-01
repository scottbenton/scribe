import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RealmCategoriesRepository } from "@/lib/repository/realm-categories.repository";

export function useCreateRealmCategory(realmId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ order }: { order: string }) =>
      RealmCategoriesRepository.createCategory(realmId, order),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["realm-categories", realmId],
      });
    },
  });

  return {
    createCategory: mutate,
    isLoading: isPending,
    isError,
  };
}
