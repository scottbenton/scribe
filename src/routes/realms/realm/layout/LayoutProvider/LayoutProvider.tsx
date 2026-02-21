import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { LayoutContext } from "./LayoutContext";
import { useBreakpointBelow } from "@/hooks/useBreakpoint";

export function LayoutProvider(props: PropsWithChildren) {
  const { children } = props;
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isSidebarADrawer = useBreakpointBelow("md", {
    onChange: (isBelow) => {
      if (!isBelow) {
        setIsMobileSidebarOpen(false);
      }
    },
  });

  const isSidebarOpen = useMemo(() => {
    if (isSidebarADrawer) {
      return isMobileSidebarOpen;
    } else {
      return isDesktopSidebarOpen;
    }
  }, [isSidebarADrawer, isMobileSidebarOpen, isDesktopSidebarOpen]);

  const setIsSidebarOpen = useMemo(() => {
    if (isSidebarADrawer) {
      return setIsMobileSidebarOpen;
    } else {
      return setIsDesktopSidebarOpen;
    }
  }, [isSidebarADrawer]);

  const toggleSidebarOpen = useCallback(() => {
    setIsSidebarOpen((open) => !open);
  }, [setIsSidebarOpen]);

  return (
    <LayoutContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebarOpen,
        isSidebarADrawer,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
