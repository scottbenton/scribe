import { type IconConfig } from "./icon-config.type";

export interface IRealmCategory {
  id: string;
  realmId: string;
  label?: string;
  order: string;
  icon: IconConfig | null;
  createdAt: Date;
}
