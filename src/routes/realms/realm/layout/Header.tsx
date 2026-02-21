import { css } from "styled-system/css";
import {
  PanelLeftIcon,
  PanelLeftOpenIcon,
  PanelLeftCloseIcon,
} from "lucide-react";
import { useLayout } from "./LayoutProvider";
import { Box } from "styled-system/jsx";
import { IconButton } from "@/components/ui";

export function Header() {
  const { isSidebarOpen, isSidebarADrawer, toggleSidebarOpen } = useLayout();
  return (
    <div
      className={css({
        py: "1",
        px: "1",
        borderBottom: "1px solid",
        borderColor: "border",
      })}
    >
      <Box
        h={"10"}
        fontSize="lg"
        fontWeight="bold"
        display="flex"
        alignItems="center"
      >
        <IconButton variant="plain" onClick={toggleSidebarOpen}>
          {isSidebarADrawer ? (
            <PanelLeftIcon />
          ) : isSidebarOpen ? (
            <PanelLeftCloseIcon />
          ) : (
            <PanelLeftOpenIcon />
          )}
        </IconButton>
        Header
      </Box>
    </div>
  );
}
