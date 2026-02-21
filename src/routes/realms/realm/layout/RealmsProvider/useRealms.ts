import { useContext } from "react";
import { RealmsContext } from "./RealmsContext";
import { useRealmId } from "../../hooks/useRealmId";

export function useRealms() {
  return useContext(RealmsContext);
}

export function useRealm() {
  const realmId = useRealmId();
  const { realms, isLoading, error } = useRealms();
  const realm = realms[realmId];

  return { realm, isLoading, error };
}
