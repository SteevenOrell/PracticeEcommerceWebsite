import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/inter";
import "@fontsource/anton";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>
);
