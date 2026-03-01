import { type JSONContent } from "@tiptap/core";

import { type IconConfig } from "./icon-config.type";

export interface IRealmCategoryItem {
  id: string;
  categoryId: string;
  label?: string;
  order: string;
  icon: IconConfig | null;
  createdAt: Date;
}

export interface IRealmCategoryItemDetail extends IRealmCategoryItem {
  notesText: JSONContent | null;
  fieldContents: Record<string, unknown>;
}
