import { useInitializeTheme } from "@/lib/theme/useInitializeTheme";
import { useListenToAuth } from "@/store/auth.store";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  useInitializeTheme();
  useListenToAuth();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
