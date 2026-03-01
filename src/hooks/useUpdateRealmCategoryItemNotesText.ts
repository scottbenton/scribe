import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";
import { type IRealmCategoryItemDetail } from "@/types/realm-category-items.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type JSONContent } from "@tiptap/core";

export function useUpdateRealmCategoryItemNotesText(itemId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (params: { notes: JSONContent; notesText: string }) =>
      RealmCategoryItemsRepository.updateNotesText(
        itemId,
        params.notes,
        params.notesText,
      ),
    onSuccess: (_data, notesText) => {
      queryClient.setQueryData<IRealmCategoryItemDetail>(
        ["realm-category-item", itemId],
        (old) => (old ? { ...old, notesText } : old),
      );
    },
  });

  return {
    updateNotesText: mutate,
    isLoading: isPending,
    isError,
  };
}
