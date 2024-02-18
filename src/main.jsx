import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import OuterComponent from "./OuterComponent.jsx";
import "./index.css";

function initialize() {}

function playButtonClick() {}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OuterComponent />
  </React.StrictMode>,
);

console.log("hi");
