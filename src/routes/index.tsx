import { Route, Switch } from "wouter";
import { AuthPage } from "./auth";
import { AuthBlocker } from "./AuthBlocker";
import { routes } from "./routes";
import {
  CategoryPage,
  CreateRealmPage,
  DefaultRealmPage,
  RealmLayout,
  RealmPage,
} from "./realms";

export function Routes() {
  return (
    <Switch>
      <Route path={routes.auth}>
        <AuthBlocker redirectIfAuthenticated={routes.root}>
          <AuthPage />
        </AuthBlocker>
      </Route>
      {/*We nest this route for layout*/}
      <Route path={routes.root} nest>
        <AuthBlocker
          redirectIfUnauthenticated={routes.auth}
          redirectWithContinue
        >
          <Switch>
            <Route path={routes.root}>
              <DefaultRealmPage />
            </Route>
            <Route path={routes.createRealm}>
              <CreateRealmPage />
            </Route>
            <Route path={routes.realm(":realmId")} nest>
              <RealmLayout>
                <Switch>
                  <Route path={routes.category(":realmId", ":categoryId")}>
                    <CategoryPage />
                  </Route>
                  <Route path={routes.realm(":realmId")}>
                    <RealmPage />
                  </Route>
                </Switch>
              </RealmLayout>
            </Route>
          </Switch>
        </AuthBlocker>
      </Route>
    </Switch>
  );
}
