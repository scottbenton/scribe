import { useState, useEffect, type ComponentType } from "react";
import { Box } from "styled-system/jsx";
import type { IconType } from "react-icons/lib";
import { Icon, IconProps } from "../ui";
import { css } from "styled-system/css";

interface GameIconProps extends IconProps {
  iconKey: string;
}

export function GameIcon(props: GameIconProps) {
  const { iconKey, ...iconProps } = props;
  const [IconComponent, setIconComponent] = useState<IconType | null>(null);

  useEffect(() => {
    import("react-icons/gi").then((mod) => {
      const icon = (mod as unknown as Record<string, IconType>)[iconKey];
      setIconComponent(() => icon ?? null);
    });
  }, [iconKey]);

  if (!IconComponent) return <Icon {...iconProps} />;
  return (
    <Icon {...iconProps} asChild>
      <IconComponent />
    </Icon>
  );
}
