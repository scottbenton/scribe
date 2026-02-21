import { IRealm } from "@/types/realms.type";
import { createContext } from "react";

interface IRealmsContext {
  realms: Record<string, IRealm>;
  isLoading: boolean;
  error: Error | null;
}

export const RealmsContext = createContext<IRealmsContext>({
  realms: {},
  isLoading: true,
  error: null,
});
