import { RealmsRepository } from "@/lib/repository/realms.repository";
import { useUID } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";

export function useUsersRealms() {
  const uid = useUID();
  const { data, isLoading, error } = useQuery({
    queryKey: ["users-realms", uid],
    queryFn: async () => {
      const realms = await RealmsRepository.getUsersRealms(uid);
      const sortedRealms = [...realms].sort(
        (r1, r2) => r2.createdAt.getTime() - r1.createdAt.getTime(),
      );
      return sortedRealms;
    },
  });

  return {
    realms: data,
    isLoading,
    error,
    hasLoaded: data !== undefined,
  };
}
