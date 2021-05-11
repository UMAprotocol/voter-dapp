import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Providers from "./Providers";
import reportWebVitals from "./reportWebVitals";
import "tailwindcss/dist/base.min.css";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStyles } from "twin.macro";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <Providers />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
