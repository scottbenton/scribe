import {
  getThemeSettings,
  radii,
  Radius,
  setRadius,
  visibleRadii,
} from "@/lib/theme";
import { useState } from "react";
import { css } from "styled-system/css";

export function BorderRadiusPicker() {
  const [selectedRadius, setSelectedRadius] = useState(
    () => getThemeSettings().radius,
  );

  const handleRadiusChange = (radius: Radius) => {
    setSelectedRadius(radius);
    setRadius(radius);
  };

  return (
    <section
      className={css({ display: "flex", flexDirection: "column", gap: "3" })}
    >
      <h3
        className={css({
          fontSize: "sm",
          fontWeight: "semibold",
          color: "fg.default",
        })}
      >
        Border Radius
      </h3>
      <div className={css({ display: "flex", gap: "2" })}>
        {visibleRadii.map((radius) => (
          <button
            key={radius}
            title={radius}
            onClick={() => handleRadiusChange(radius)}
            className={css({
              width: "10",
              height: "10",
              border: "1px solid",
              borderColor: "gray.a6",
              cursor: "pointer",
              bg: "transparent",
              transition: "border-color 0.15s, background-color 0.15s",
            })}
            style={{
              backgroundColor:
                selectedRadius === radius
                  ? "var(--colors-primary-a3)"
                  : undefined,
              borderColor:
                selectedRadius === radius
                  ? "var(--colors-primary-9)"
                  : undefined,
              borderRadius: `var(--radii-${radii[radius].l2})`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
