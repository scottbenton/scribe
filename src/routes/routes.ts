export const routes = {
  auth: "/auth",
  root: "/",
  createRealm: "/realms/create",
  realm: (id: string) => `/realms/${id}`,
  category: (realmId: string, categoryId: string) =>
    `/realms/${realmId}/category/${categoryId}`,
  item: (realmId: string, categoryId: string, itemId: string) =>
    `/realms/${realmId}/category/${categoryId}/item/${itemId}`,
};
