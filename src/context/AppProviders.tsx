import { PropsWithChildren } from "react";

import { useInitializeTheme } from "@/lib/theme/useInitializeTheme";

import { useListenToAuth } from "@/store/auth.store";

import { TanstackQueryProvider } from "./TanstackQueryProvider";

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  useInitializeTheme();
  useListenToAuth();

  return <TanstackQueryProvider>{children}</TanstackQueryProvider>;
}
