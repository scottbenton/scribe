import { PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";
import { LayoutProvider } from "./LayoutProvider";
import { Header } from "./Header";
import { css } from "styled-system/css";
import { ScrollArea } from "@/components/ui";
import { RealmsProvider } from "./RealmsProvider";
import { Box } from "styled-system/jsx";

export function RealmLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <RealmsProvider>
      <LayoutProvider>
        <div
          className={css({
            height: "screen",
            display: "flex",
            flexDirection: "row",
          })}
        >
          <Sidebar />
          <div
            className={css({
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            })}
          >
            <Header />
            <Box flexGrow={1} overflow="hidden">
              <ScrollArea.Root>
                <ScrollArea.Viewport>
                  <ScrollArea.Content
                    display="flex"
                    flexGrow={1}
                    flexDirection="column"
                    position="relative"
                  >
                    {children}
                  </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar>
                  <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Root>
            </Box>
          </div>
        </div>
      </LayoutProvider>
    </RealmsProvider>
  );
}
