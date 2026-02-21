export interface IRealmCategoryItem {
  id: string;
  categoryId: string;
  label: string;
  order: string;
  createdAt: Date;
}

export interface IRealmCategoryItemDetail extends IRealmCategoryItem {
  notesText: unknown | null;
  fieldContents: Record<string, unknown>;
}
