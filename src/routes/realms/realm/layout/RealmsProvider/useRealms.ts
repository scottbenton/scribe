import { useContext } from "react";

import { useRealmId } from "../../hooks/useRealmId";
import { RealmsContext } from "./RealmsContext";

export function useRealms() {
  return useContext(RealmsContext);
}

export function useRealm() {
  const realmId = useRealmId();
  const { realms, isLoading, error } = useRealms();
  const realm = realms[realmId];

  return { realm, isLoading, error };
}
