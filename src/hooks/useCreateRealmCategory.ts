import { RealmCategoriesRepository } from "@/lib/repository/realm-categories.repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateRealmCategory(realmId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ name, order }: { name: string; order: string }) =>
      RealmCategoriesRepository.createCategory(realmId, name, order),
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
