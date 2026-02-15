import { useInitializeTheme } from "./lib/theme/useInitializeTheme";
import { Routes } from "./routes";
import { useListenToAuth } from "./store/auth.store";

export function App() {
  useInitializeTheme();
  useListenToAuth();

  return (
    <main className="container">
      <Routes />
    </main>
  );
}
