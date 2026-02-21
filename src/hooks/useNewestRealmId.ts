import { RealmsRepository } from "@/lib/repository/realms.repository";
import { useUID } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";

export function useNewestRealmId() {
  const uid = useUID();
  const { data, isLoading, error } = useQuery({
    queryKey: ["newest-realm", uid],
    queryFn: async () => await RealmsRepository.getNewestRealmId(uid),
  });

  return {
    id: data,
    isLoading,
    error,
    hasLoaded: data !== undefined,
  };
}
