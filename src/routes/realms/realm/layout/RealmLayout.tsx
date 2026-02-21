import { PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";
import { LayoutProvider } from "./LayoutProvider";
import { Header } from "./Header";
import { css } from "styled-system/css";
import { ScrollArea } from "@/components/ui";
import { RealmsProvider } from "./RealmsProvider";

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
          <div className={css({ flexGrow: 1 })}>
            <Header />
            <div>
              <ScrollArea.Root>
                <ScrollArea.Viewport>
                  <ScrollArea.Content>
                    <div
                      className={css({
                        display: "flex",
                        flex: 1,
                        overflow: "hidden",
                      })}
                    >
                      {children}
                    </div>
                  </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar>
                  <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Root>
            </div>
          </div>
        </div>
      </LayoutProvider>
    </RealmsProvider>
  );
}
