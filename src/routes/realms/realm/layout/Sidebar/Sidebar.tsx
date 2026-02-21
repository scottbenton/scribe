import { css } from "styled-system/css";
import { useLayout } from "../LayoutProvider";
import { SidebarContents } from "./SidebarContents";
import * as Drawer from "@/components/ui/drawer";

const SIDEBAR_WIDTH = "250px";

export function Sidebar() {
  const { isSidebarADrawer, isSidebarOpen, setIsSidebarOpen } = useLayout();

  if (isSidebarADrawer) {
    return (
      <Drawer.Root
        open={isSidebarOpen}
        onOpenChange={(e) => setIsSidebarOpen(e.open)}
        placement="start"
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Body p={0}>
              <SidebarContents />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    );
  }

  return (
    <div
      className={css({
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        transition:
          "transform token(durations.normal) ease-in-out, margin token(durations.normal) ease-in-out",
        overflow: "hidden",
        borderRightWidth: "1px",
        borderRightColor: "border",
        py: 1,
      })}
      style={{
        transform: isSidebarOpen
          ? "translateX(0)"
          : `translateX(-${SIDEBAR_WIDTH})`,
        marginInlineStart: isSidebarOpen ? "0" : `-${SIDEBAR_WIDTH}`,
      }}
    >
      <SidebarContents />
    </div>
  );
}
