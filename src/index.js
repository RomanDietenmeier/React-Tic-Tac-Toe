import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import { TicTacToe } from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <TicTacToe />
  </StrictMode>
);
