import React from "react";
import ReactDOM from "react-dom";
import stylemain from "../styles/main.scss";
import App from "./App.jsx";
import { hello_greeting as greeting } from "./module.js";
import fastclick from "fastclick";

// Initialize fastclick.
fastclick.attach(document.body);

// import Modernizr from "modernizr";
// if (Modernizr) {
// 	console.log("Modernizr found!");
// }

greeting();
ReactDOM.render(<App />, document.getElementById("root"));
