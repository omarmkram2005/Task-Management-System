import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Css/index.css";
import { BrowserRouter } from "react-router-dom";
import SessionContext from "./Context/SessionContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SessionContext />
    </BrowserRouter>
  </StrictMode>
);
