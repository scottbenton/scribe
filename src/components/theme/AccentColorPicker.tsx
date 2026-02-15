import { useState } from "react";
import { createListCollection } from "@ark-ui/react/select";
import { css } from "styled-system/css";
import { ColorKey, colors, getThemeSettings, setColor } from "@/lib/theme";
import { Select } from "../ui";

const accentColorItems: { label: string; value: string }[] = Object.values(
  colors,
).map((color) => ({
  label: color.name,
  value: color.key,
}));

const collection = createListCollection({ items: accentColorItems });

export function AccentColorPicker() {
  const [selectedAccent, setSelectedAccent] = useState<ColorKey>(
    () => getThemeSettings().accentColor,
  );

  const handleAccentChange = (details: Select.ValueChangeDetails) => {
    const color = details.value[0] as ColorKey;
    if (!color) return;
    setSelectedAccent(color);
    setColor(color);
  };

  return (
    <section
      className={css({ display: "flex", flexDirection: "column", gap: "3" })}
    >
      <Select.Root
        collection={collection}
        value={[selectedAccent]}
        onValueChange={handleAccentChange}
        positioning={{ sameWidth: true }}
      >
        <Select.Label
          className={css({
            fontSize: "sm",
            fontWeight: "semibold",
            color: "fg.default",
          })}
        >
          Accent Color
        </Select.Label>
        <Select.Control>
          <Select.Trigger>
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "2",
              })}
            >
              <span
                className={css({
                  width: "3.5",
                  height: "3.5",
                  borderRadius: "full",
                  flexShrink: 0,
                })}
                style={{ backgroundColor: `var(--colors-${selectedAccent}-9)` }}
              />
              <Select.ValueText placeholder="Select a color" />
            </div>
            <Select.Indicator />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {accentColorItems.map((item) => (
              <Select.Item key={item.value} item={item}>
                <div
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: "2",
                  })}
                >
                  <span
                    className={css({
                      width: "3.5",
                      height: "3.5",
                      borderRadius: "full",
                      flexShrink: 0,
                    })}
                    style={{ backgroundColor: `var(--colors-${item.value}-9)` }}
                  />
                  <Select.ItemText>{item.label}</Select.ItemText>
                </div>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </section>
  );
}
