import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import { queryClient } from "./client";

export function TanstackQueryProvider(props: PropsWithChildren) {
  const { children } = props;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
