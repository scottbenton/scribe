import {
  IRealmCategoryItem,
  IRealmCategoryItemDetail,
} from "@/types/realm-category-items.type";
import { supabase } from "../supabase.lib";

export class RealmCategoryItemsRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static table = () => supabase.from("realm_category_items" as any);

  public static async getAllInCategory(
    categoryId: string,
  ): Promise<IRealmCategoryItem[]> {
    const { data, error } = await this.table()
      .select("id, label, order, category_id, created_at")
      .eq("category_id", categoryId)
      .order("order", { ascending: true });

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch realm category items");
    }

    return data.map((row: any) => ({
      id: row.id,
      categoryId: row.category_id,
      label: row.label,
      order: row.order,
      createdAt: new Date(row.created_at),
    }));
  }

  public static async getItem(id: string): Promise<IRealmCategoryItemDetail> {
    const { data, error } = await this.table()
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch realm category item");
    }

    const row = data as any;
    return {
      id: row.id,
      categoryId: row.category_id,
      label: row.label,
      order: row.order,
      createdAt: new Date(row.created_at),
      notesText: row.notes_text ?? null,
      fieldContents: row.field_contents ?? {},
    };
  }

  public static async createItem(
    categoryId: string,
    label: string,
    order: string,
  ): Promise<IRealmCategoryItem> {
    const { data, error } = await this.table()
      .insert({ category_id: categoryId, label, order })
      .select("id, label, order, category_id, created_at")
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to create realm category item");
    }

    const row = data as any;
    return {
      id: row.id,
      categoryId: row.category_id,
      label: row.label,
      order: row.order,
      createdAt: new Date(row.created_at),
    };
  }

  public static async updateLabel(id: string, label: string): Promise<void> {
    const { error } = await this.table().update({ label }).eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update realm category item label");
    }
  }

  public static async updateOrder(id: string, order: string): Promise<void> {
    const { error } = await this.table().update({ order }).eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update realm category item order");
    }
  }

  public static async deleteItem(id: string): Promise<void> {
    const { error } = await this.table().delete().eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete realm category item");
    }
  }
}
