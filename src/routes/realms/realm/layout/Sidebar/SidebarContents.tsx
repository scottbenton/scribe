import { ScrollArea } from "@/components/ScrollArea";
import { EditThemeButton } from "@/components/theme/EditThemeButton";
import { Box } from "styled-system/jsx";

import { Categories } from "./Categories";
import { ChooseRealm } from "./ChooseRealm";

export function SidebarContents() {
  return (
    <Box display="flex" flexDir="column" h="full" w="full">
      <Box flexGrow={1}>
        <Box>
          <ChooseRealm />
          <ScrollArea>
            <Categories />
          </ScrollArea>
        </Box>
      </Box>
      <Box p={1} borderTopWidth={1} borderColor="border">
        <EditThemeButton />
      </Box>
    </Box>
  );
}
