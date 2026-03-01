import { type JSONContent } from "@tiptap/core";

import { type IconConfig } from "@/types/icon-config.type";
import {
  IRealmCategoryItem,
  IRealmCategoryItemDetail,
} from "@/types/realm-category-items.type";
import { Json } from "@/types/supabase.type";

import { supabase } from "../supabase.lib";

export class RealmCategoryItemsRepository {
  private static table = () => supabase.from("realm_category_items");

  public static async getAllInCategory(
    categoryId: string,
  ): Promise<IRealmCategoryItem[]> {
    const { data, error } = await this.table()
      .select("id, label, order, icon, category_id, created_at")
      .eq("category_id", categoryId)
      .order("order", { ascending: true });

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch realm category items");
    }

    return data.map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      label: row.label ?? undefined,
      order: row.order,
      icon: (row.icon as IconConfig | null) ?? null,
      createdAt: new Date(row.created_at),
    }));
  }

  public static async getItem(id: string): Promise<IRealmCategoryItemDetail> {
    const { data, error } = await this.table()
      .select(
        "id, category_id, label, order, icon, field_contents, notes, created_at",
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch realm category item");
    }

    const row = data;
    return {
      id: row.id,
      categoryId: row.category_id,
      label: row.label ?? undefined,
      order: row.order,
      icon: (row.icon as IconConfig | null) ?? null,
      createdAt: new Date(row.created_at),
      notesText: (row.notes as unknown as JSONContent) ?? null,
      fieldContents: (row.field_contents as Record<string, unknown>) ?? {},
    };
  }

  public static async createItem(
    categoryId: string,
    order: string,
  ): Promise<IRealmCategoryItem> {
    const { data, error } = await this.table()
      .insert({ category_id: categoryId, order })
      .select("id, label, order, icon, category_id, created_at")
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to create realm category item");
    }

    const row = data;
    return {
      id: row.id,
      categoryId: row.category_id,
      label: row.label ?? undefined,
      order: row.order,
      icon: (row.icon as IconConfig | null) ?? null,
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

  public static async updateIcon(
    id: string,
    icon: IconConfig | null,
  ): Promise<void> {
    const { error } = await this.table()
      .update({ icon: icon as unknown as Json })
      .eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update realm category item icon");
    }
  }

  public static async updateNotesText(
    id: string,
    notes: JSONContent,
    notesText: string,
  ): Promise<void> {
    const { error } = await this.table()
      .update({ notes, notes_text: notesText })
      .eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update realm category item notes text");
    }
  }

  public static updateNotesTextBeacon(
    id: string,
    notes: JSONContent,
    notesText: string,
    token: string,
  ): void {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/realm_category_items?id=eq.${id}`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ notes, notes_text: notesText }),
      keepalive: true,
    });
  }

  public static async deleteItem(id: string): Promise<void> {
    const { error } = await this.table().delete().eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete realm category item");
    }
  }
}
