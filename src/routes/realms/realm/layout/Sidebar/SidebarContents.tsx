import { EditThemeButton } from "@/components/theme/EditThemeButton";
import { ScrollArea } from "@/components/ScrollArea";
import { Box } from "styled-system/jsx";
import { ChooseRealm } from "./ChooseRealm";
import { Categories } from "./Categories";

export function SidebarContents() {
  return (
    <Box display="flex" flexDir="column" h="full" w="full">
      <Box flexGrow={1}>
        <ScrollArea>
          <Box>
            <ChooseRealm />
            <Categories />
          </Box>
        </ScrollArea>
      </Box>
      <Box p={1} borderTopWidth={1} borderColor="border">
        <EditThemeButton />
      </Box>
    </Box>
  );
}
