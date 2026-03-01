import { type IconColorKey } from "@/components/IconPicker/iconColors";

export interface GameIconConfig {
  type: "game_icon";
  key: string;
  color: IconColorKey;
}

export type IconConfig = GameIconConfig;
