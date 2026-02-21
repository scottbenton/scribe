export enum RealmUserRole {
  Owner = "owner",
}

export interface IRealm {
  id: string;
  name: string;
  role: RealmUserRole;
  createdAt: Date;
  userAddedAt: Date;
}
