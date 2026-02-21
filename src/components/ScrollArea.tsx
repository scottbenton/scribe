import { PropsWithChildren } from "react";
import { ScrollArea as UIScrollArea } from "./ui";
import { css } from "styled-system/css";
export function ScrollArea(props: PropsWithChildren) {
  const { children } = props;

  return (
    <UIScrollArea.Root>
      <UIScrollArea.Viewport>
        <UIScrollArea.Content>
          <div
            className={css({
              flex: 1,
              overflow: "hidden",
            })}
          >
            {children}
          </div>
        </UIScrollArea.Content>
      </UIScrollArea.Viewport>
      <UIScrollArea.Scrollbar>
        <UIScrollArea.Thumb />
      </UIScrollArea.Scrollbar>
      <UIScrollArea.Corner />
    </UIScrollArea.Root>
  );
}
