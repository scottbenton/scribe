import { useParams } from "wouter";

export function useRealmId() {
  const { realmId } = useParams<{ realmId: string }>();
  return realmId;
}
