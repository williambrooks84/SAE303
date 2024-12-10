import { HeaderView } from "./ui/header/index.js";
import { PieView } from "./ui/pie/index.js";
import { SalesCounterView } from "./ui/salescounter/index.js";
import { RentalsCounterView } from "./ui/rentalscounter/index.js";
import { SaleData } from "./data/sales.js";
import { RentalData } from "./data/rentals.js";

import "./index.css";

let C = {};

C.init = async function () {
  V.init();
};

let V = {
  header: document.querySelector("#header"),
  //chart: document.querySelector("#chart"),
  salescounter: document.querySelector("#salescounter"),
  rentalscounter: document.querySelector("#rentalscounter"),
};

V.init = function () {
  V.render();
};

V.render = function () {
  V.header.innerHTML = HeaderView.render();

  /*
  const chartData = [
    { category: "Category A", value: 40 },
    { category: "Category B", value: 30 },
    { category: "Category C", value: 20 },
    { category: "Category D", value: 10 },
  ];

  // Render the chart
  PieView.render("chart", chartData);
  */
  updateSalesCounter();
  updateRentalsCounter();
};

C.init();

async function updateSalesCounter() {
  try {
    const salesData = await SaleData.fetchAll();
    
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1); 


    const recentSales = salesData.filter(sale => {

      const saleDate = new Date(sale.purchase_date.date); 

      return saleDate >= oneMonthAgo && saleDate <= currentDate;
    });

    const totalSales = recentSales.reduce((total, sale) => {
      return total + parseFloat(sale.purchase_price);
    }, 0);

    const salesCounterHTML = SalesCounterView.render(totalSales.toFixed(2));
    V.salescounter.innerHTML = salesCounterHTML.replace("{{sales}}", totalSales.toFixed(2));

  } catch (error) {
    console.error('Error fetching sales data:', error);
    V.salescounter.innerHTML = "Failed to load sales data"; 
  }
}

async function updateRentalsCounter() {
  try {
    const rentalsData = await RentalData.fetchAll();
    
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1); 


    const recentRentals = rentalsData.filter(rental => {

      const rentalDate = new Date(rental.rental_date.date); 

      return rentalDate >= oneMonthAgo && rentalDate <= currentDate;
    });

    const totalRentals = recentRentals.reduce((total, rental) => {
      return total + parseFloat(rental.rental_price);
    }, 0);

    const rentalsCounterHTML = RentalsCounterView.render(totalRentals.toFixed(2));
    V.rentalscounter.innerHTML = rentalsCounterHTML.replace("{{rentals}}", totalRentals.toFixed(2));

  } catch (error) {
    console.error('Error fetching sales data:', error);
    V.rentalscounter.innerHTML = "Failed to load sales data"; 
  }
}

