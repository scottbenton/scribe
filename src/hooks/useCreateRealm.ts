import { RealmsRepository } from "@/lib/repository/realms.repository";
import { useMutation } from "@tanstack/react-query";

export function useCreateRealm() {
  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: async (name: string) => {
      const realm = await RealmsRepository.createRealm(name);
      return realm.id;
    },
  });

  return {
    createRealm: mutate,
    realmId: data,
    isLoading: isPending,
    isError: isError,
  };
}
