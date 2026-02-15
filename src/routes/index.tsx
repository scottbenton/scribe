import { Route, Switch } from "wouter";
import { AuthPage } from "./auth";

export function Routes() {
  return (
    <Switch>
      <Route path="/auth">
        <AuthPage />
      </Route>
      {/*We nest this route for layout*/}
      <Route path="/" nest>
        <span>Layout</span>
        <Route path="/">
          <span>Home Page</span>
        </Route>
        <Route path="/about">About Page</Route>
      </Route>
    </Switch>
  );
}
