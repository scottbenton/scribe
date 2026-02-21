import { IRealm, RealmUserRole } from "@/types/realms.type";
import { supabase } from "../supabase.lib";
import { Tables } from "@/types/supabase.type";

type RealmUserDAO = Tables<"realm_users">;

export class RealmsRepository {
  public static realmUsers = () => supabase.from("realm_users");
  public static realms = () => supabase.from("realms");

  public static async createRealm(name: string): Promise<IRealm> {
    const { data, error } = await supabase.rpc("create_realm", {
      realm_name: name,
    });

    if (error) {
      console.error(error);
      throw new Error("Failed to create realm");
    }

    return {
      id: data.id,
      name: data.name,
      role: RealmUserRole.Owner,
      createdAt: new Date(data.created_at),
      userAddedAt: new Date(data.created_at),
    };
  }

  public static async getUsersRealms(uid: string): Promise<IRealm[]> {
    const { data, error } = await this.realmUsers()
      .select("*, realms(*)")
      .eq("user_id", uid);

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch user realms");
    }

    return data.map((realmUser) => ({
      id: realmUser.realms.id,
      name: realmUser.realms.name,
      role: this.convertRole(realmUser.role),
      createdAt: new Date(realmUser.realms.created_at),
      userAddedAt: new Date(realmUser.created_at),
    }));
  }

  public static async getNewestRealmId(uid: string): Promise<string | null> {
    const { data, error } = await this.realmUsers()
      .select("realm_id")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch newest realm id");
    }

    if (!data) return null;

    return data.realm_id;
  }

  private static convertRole(role: RealmUserDAO["role"]): RealmUserRole {
    switch (role) {
      case "owner":
        return RealmUserRole.Owner;
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  }
}
