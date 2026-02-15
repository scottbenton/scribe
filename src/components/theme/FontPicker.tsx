import { useState } from "react";
import { createListCollection } from "@ark-ui/react/select";
import { css } from "styled-system/css";
import { Select } from "@/components/ui";
import {
  allFontItems,
  fontGroups,
  getThemeSettings,
  setFont,
} from "@/lib/theme";

const collection = createListCollection({
  items: allFontItems,
  groupBy: (item) => item.group,
  itemToValue: (item) => item.variable,
});

export function FontPicker() {
  const [selectedFont, setSelectedFont] = useState(
    () => getThemeSettings().font,
  );

  const handleValueChange = (details: Select.ValueChangeDetails) => {
    const variable = details.items[0].variable;
    setSelectedFont(variable);
    setFont(variable);
  };

  return (
    <section
      className={css({ display: "flex", flexDirection: "column", gap: "3" })}
    >
      <Select.Root
        collection={collection}
        value={[selectedFont]}
        onValueChange={handleValueChange}
        positioning={{ sameWidth: true }}
      >
        <Select.Label
          className={css({
            fontSize: "sm",
            fontWeight: "semibold",
            color: "fg.default",
          })}
        >
          Font
        </Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a font" />
            <Select.Indicator />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {fontGroups.map((group) => (
              <Select.ItemGroup key={group.label}>
                <Select.ItemGroupLabel>{group.label}</Select.ItemGroupLabel>
                {group.fonts.map((font) => (
                  <Select.Item key={font.name} item={font}>
                    <Select.ItemText>
                      <span style={{ fontFamily: `var(--${font.variable}` }}>
                        {font.name}
                      </span>
                    </Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </section>
  );
}
