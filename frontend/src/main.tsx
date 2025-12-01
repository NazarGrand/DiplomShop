import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "theme-ui";
import App from "./App";
import "./index.css";
import theme from "./theme";

import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
