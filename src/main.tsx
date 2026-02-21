import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

// Clean
import "@fontsource-variable/inter";
import "@fontsource-variable/rubik";
import "@fontsource-variable/lora";
import "@fontsource-variable/lora/wght-italic.css";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@fontsource/ibm-plex-serif";
import "@fontsource/ibm-plex-serif/400-italic.css";
import "@fontsource/ibm-plex-serif/700-italic.css";

// Fantasy
import "@fontsource-variable/vollkorn";
import "@fontsource-variable/bitter";
import "@fontsource/im-fell-english";
import "@fontsource/im-fell-english/400-italic.css";

// Space Age
import "@fontsource-variable/orbitron";
import "@fontsource-variable/exo-2";
import "@fontsource/rajdhani";
import "@fontsource/rajdhani/700.css";

// Terminal
import "@fontsource/space-mono";
import "@fontsource/space-mono/400-italic.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/space-mono/700-italic.css";
import "@fontsource/ibm-plex-mono";
import "@fontsource/ibm-plex-mono/400-italic.css";
import "@fontsource/ibm-plex-mono/700.css";
import "@fontsource/ibm-plex-mono/700-italic.css";

// Accessibility
import "@fontsource-variable/lexend";
import { AppProviders } from "./context/AppProviders";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
