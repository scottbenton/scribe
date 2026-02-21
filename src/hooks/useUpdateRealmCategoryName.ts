import { RealmCategoriesRepository } from "@/lib/repository/realm-categories.repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateRealmCategoryName(realmId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      RealmCategoriesRepository.updateName(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realm-categories", realmId] });
    },
  });

  return {
    updateName: mutate,
    isLoading: isPending,
    isError,
  };
}
