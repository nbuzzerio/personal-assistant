import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ThemeContext from "./components/ThemeContext/index.ts";
import "./style.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContext>
      <App />
    </ThemeContext>
  </React.StrictMode>,
);
