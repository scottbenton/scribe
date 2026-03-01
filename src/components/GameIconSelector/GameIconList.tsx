import { IconButton, Spinner, Text } from "@/components/ui";
import { useEffect, useMemo, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { css } from "styled-system/css";
import { Box } from "styled-system/jsx";

import { IconColorKey, resolveIconColor } from "../IconPicker/iconColors";
import { GameIcon } from "./GameIcon";
import { getIconName } from "./getIconName";

interface GameIconListProps {
  search: string;
  onSelect: (iconKey: string) => void;
  color?: IconColorKey;
}

const listClass = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
  gap: "1",
});

const itemClass = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export function GameIconList(props: GameIconListProps) {
  const { search, onSelect, color } = props;
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("react-icons/gi").then((mod) => {
      setAllKeys(Object.keys(mod));
      setIsLoading(false);
    });
  }, []);

  const filteredKeys = useMemo(() => {
    if (!search.trim()) return allKeys;
    const lower = search.toLowerCase();
    return allKeys.filter((k) => getIconName(k).toLowerCase().includes(lower));
  }, [allKeys, search]);

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" h="400px">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDir="column" flex="1" minH="0" w="full">
      <VirtuosoGrid
        style={{ height: "400px", overflowX: "hidden" }}
        data={filteredKeys}
        listClassName={listClass}
        itemClassName={itemClass}
        computeItemKey={(_, key) => key}
        itemContent={(_, iconKey) => (
          <IconButton
            variant="plain"
            size="lg"
            title={getIconName(iconKey)}
            aria-label={getIconName(iconKey)}
            onClick={() => onSelect(iconKey)}
          >
            <Box style={{ color: resolveIconColor(color) }}>
              <GameIcon iconKey={iconKey} />
            </Box>
          </IconButton>
        )}
      />
      <Text textStyle="xs" color="fg.subtle" textAlign="center" py={2}>
        Icons from{" "}
        <a href="https://game-icons.net" target="_blank" rel="noreferrer">
          Game Icons
        </a>{" "}
        (CC BY 3.0)
      </Text>
    </Box>
  );
}
