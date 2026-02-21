import { createContext } from "react";

interface ILayoutContext {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebarOpen: () => void;
  isSidebarADrawer: boolean;
}

export const LayoutContext = createContext<ILayoutContext>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  toggleSidebarOpen: () => {},
  isSidebarADrawer: false,
});
