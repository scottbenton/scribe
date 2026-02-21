import { IRealmCategory } from "@/types/realm-categories.type";
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
      name: row.name,
      order: row.order,
      createdAt: new Date(row.created_at),
    }));
  }

  public static async updateName(id: string, name: string): Promise<void> {
    const { error } = await this.table().update({ name }).eq("id", id);

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

  public static async createCategory(
    realmId: string,
    name: string,
    order: string,
  ): Promise<IRealmCategory> {
    const { data, error } = await this.table()
      .insert({ realm_id: realmId, name, order })
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error("Failed to create realm category");
    }

    return {
      id: data.id,
      realmId: data.realm_id,
      name: data.name,
      order: data.order,
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
