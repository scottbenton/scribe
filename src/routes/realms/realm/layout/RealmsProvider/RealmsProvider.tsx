import { useUsersRealms } from "@/hooks/useUsersRealms";
import { PropsWithChildren, useMemo } from "react";
import { RealmsContext } from "./RealmsContext";

export function RealmsProvider(props: PropsWithChildren) {
  const { children } = props;

  const { realms, isLoading, error, hasLoaded } = useUsersRealms();

  const realmObject = useMemo(() => {
    if (!realms) return {};
    return Object.fromEntries(realms.map((realm) => [realm.id, realm]));
  }, [realms]);

  return (
    <RealmsContext.Provider
      value={{ realms: realmObject, isLoading: isLoading && !hasLoaded, error }}
    >
      {children}
    </RealmsContext.Provider>
  );
}
