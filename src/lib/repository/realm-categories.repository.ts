import { type IconConfig } from "@/types/icon-config.type";
import { IRealmCategory } from "@/types/realm-categories.type";
import { Json } from "@/types/supabase.type";

import { supabase } from "../supabase.lib";

export class RealmCategoriesRepository {
  private static table = () => supabase.from("realm_categories");

  public static async getCategoriesForRealm(
    realmId: string,
  ): Promise<IRealmCategory[]> {
    const { data, error } = await this.table()
      .select("*")
      .eq("realm_id", realmId)
      .order("order", { ascending: true });

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch realm categories");
    }

    return data.map((row) => ({
      id: row.id,
      realmId: row.realm_id,
      label: row.label ?? undefined,
      order: row.order,
      icon: (row.icon as IconConfig | null) ?? null,
      createdAt: new Date(row.created_at),
    }));
  }

  public static async updateName(id: string, label: string): Promise<void> {
    const { error } = await this.table().update({ label }).eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update realm category name");
    }
  }

  public static async updateOrder(id: string, order: string): Promise<void> {
    const { error } = await this.table().update({ order }).eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update realm category order");
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
      throw new Error("Failed to update realm category icon");
    }
  }

  public static async createCategory(
    realmId: string,
    order: string,
  ): Promise<IRealmCategory> {
    const { data, error } = await this.table()
      .insert({ realm_id: realmId, order })
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to create realm category");
    }

    return {
      id: data.id,
      realmId: data.realm_id,
      label: data.label ?? undefined,
      order: data.order,
      icon: (data.icon as IconConfig | null) ?? null,
      createdAt: new Date(data.created_at),
    };
  }

  public static async deleteCategory(id: string): Promise<void> {
    const { error } = await this.table().delete().eq("id", id);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete realm category");
    }
  }
}
