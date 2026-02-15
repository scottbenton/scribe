import { useInitializeTheme } from "./lib/theme/useInitializeTheme";
import { Routes } from "./routes";

export function App() {
  useInitializeTheme();
  return (
    <main className="container">
      <Routes />
    </main>
  );
}
