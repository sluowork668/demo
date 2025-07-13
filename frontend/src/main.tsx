// src/main.tsx

/**
 * Entry point for the React application.
 * This file initializes the React root and renders the App component inside the <div id="root"> element.
 * The App is wrapped in <React.StrictMode> to help identify potential problems in development mode.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
