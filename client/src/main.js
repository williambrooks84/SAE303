import { HeaderView } from "./ui/header/index.js";
import { PieView } from "./ui/pie/index.js";

import "./index.css";

let C = {};

C.init = async function () {
  V.init();
};

let V = {
  header: document.querySelector("#header"),
  chart: document.querySelector("#chart"),
};

V.init = function () {
  V.render();
};

V.render = function () {
  V.header.innerHTML = HeaderView.render();

  const chartData = [
    { category: "Category A", value: 40 },
    { category: "Category B", value: 30 },
    { category: "Category C", value: 20 },
    { category: "Category D", value: 10 },
  ];

  // Render the chart
  PieView.render("header", chartData);
};

C.init();
