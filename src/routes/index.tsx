import { Route, Switch } from "wouter";
import { AuthPage } from "./auth";
import { AuthBlocker } from "./AuthBlocker";

export function Routes() {
  return (
    <Switch>
      <Route path="/auth">
        <AuthBlocker redirectIfAuthenticated="/">
          <AuthPage />
        </AuthBlocker>
      </Route>
      {/*We nest this route for layout*/}
      <Route path="/" nest>
        <AuthBlocker redirectIfUnauthenticated="/auth" redirectWithContinue>
          <span>Layout</span>
          <Route path="/">
            <span>Home Page</span>
          </Route>
          <Route path="/about">About Page</Route>
        </AuthBlocker>
      </Route>
    </Switch>
  );
}
