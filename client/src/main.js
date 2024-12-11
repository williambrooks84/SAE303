import { HeaderView } from "./ui/header/index.js";
import { PieView } from "./ui/pie/index.js";
import { SalesCounterView } from "./ui/salescounter/index.js";
import { RentalsCounterView } from "./ui/rentalscounter/index.js";
import { TopPurchasesView } from "./ui/toppurchases/index.js";
import { TopRentalsView } from "./ui/toprentals/index.js";
import { SaleData } from "./data/sales.js";
import { RentalData } from "./data/rentals.js";
import { MovieData } from "./data/movies.js";
import { SalesEvolutionView } from "./ui/salesevolutionchart/index.js";
import { RentalsEvolutionView } from "./ui/rentalsevolutionchart/index.js";
import { SalesEvolutionGenreView } from "./ui/salesevolutiongenrechart/index.js";
import { RentalsEvolutionGenreView } from "./ui/rentalsevolutiongenrechart/index.js";
import { SalesByCountryView } from "./ui/salesbycountry/index.js";
import { RentalsByCountryView } from "./ui/rentalsbycountry/index.js";

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
  toppurchases: document.querySelector("#toppurchases"),
  toprentals: document.querySelector("#toprentals"),
};

V.init = function () {
  V.render();
};

V.render = function () {
  V.header.innerHTML = HeaderView.render();

  /*  
  //Itération 2

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
  topMovies();
  topMoviesRental();
  initializeSalesChart();
  initializeRentalsChart();
  initializeSalesGenreChart();
  initializeRetalsGenreChart();
  initializeSalesByCountry();
  initializeRentalsByCountry()
};

C.init();

//Itération 3

async function updateSalesCounter() {
  let salesData = await SaleData.fetchCurrentMonth();
  const totalSales = salesData[0]["sum(purchase_price)"];
  const salesCounterHTML = SalesCounterView.render();
  V.salescounter.innerHTML = salesCounterHTML.replace("{{sales}}",totalSales);
}

async function updateRentalsCounter() {
  let rentalsData = await RentalData.fetchCurrentMonth();
  const totalRentals = rentalsData[0]["sum(rental_price)"];
  const rentalsCounterHTML = RentalsCounterView.render();
  V.rentalscounter.innerHTML = rentalsCounterHTML.replace("{{rentals}}",totalRentals);
}

//Itération 4

async function topMovies() {
    let topSalesData = await SaleData.fetchTopSalesCurrentMonth();
    const topMovies = topSalesData.map(sale => sale.movie_title);
    const topSalesHTML = TopPurchasesView.render();
    V.toppurchases.innerHTML = topSalesHTML.replace("{{movie1}}", topMovies[0]).replace("{{movie2}}", topMovies[1]).replace("{{movie3}}", topMovies[2]);
}

async function topMoviesRental() {
  let topRentalsData = await RentalData.fetchTopRentalsCurrentMonth();
  const topMovies = topRentalsData.map(rental => rental.movie_title);
  const topRentalsHTML = TopRentalsView.render();
  V.toprentals.innerHTML = topRentalsHTML.replace("{{movie1}}", topMovies[0]).replace("{{movie2}}", topMovies[1]).replace("{{movie3}}", topMovies[2]);
}

//Itération 5

async function fetchTotalSalesByMonthData() {
  const salesData = await SaleData.fetchTotalSalesByMonth();
  return salesData;
}

async function fetchTotalRentalsByMonthData() {
  const rentalsData = await RentalData.fetchTotalRentalsByMonth();
  return rentalsData;
}

async function initializeSalesChart() {
  const chartData = await fetchTotalSalesByMonthData();
  SalesEvolutionView.render("saleschartdiv", chartData);
}

async function initializeRentalsChart() {
  const chartData = await fetchTotalRentalsByMonthData();
  RentalsEvolutionView.render("rentalschartdiv", chartData);
}


//Itération 6

async function fetchTotalSalesByMonthAndGenreData(){
  const salesData = await SaleData.fetchTotalSalesByMonthAndGenre();
  return salesData;
}

async function initializeSalesGenreChart(){
  const chartData = await fetchTotalSalesByMonthAndGenreData();
  SalesEvolutionGenreView.render("saleschartgenrediv", chartData);
}

async function fetchTotalRentalsByMonthAndGenreData(){
  const rentalsData = await RentalData.fetchTotalRentalsByMonthAndGenre();
  return rentalsData;
}

async function initializeRetalsGenreChart(){
  const chartData = await fetchTotalRentalsByMonthAndGenreData();
  RentalsEvolutionGenreView.render("rentalschartgenrediv", chartData);
}

//Itération 7

async function fetchSalesByCountryData(){
  const salesData = await SaleData.fetchSalesByCountry();
  return salesData;
}

async function initializeSalesByCountry(){
  const chartData = await fetchSalesByCountryData();
  SalesByCountryView.render("salesbycountrydiv", chartData);
}

async function fetchRentalsByCountryData(){
  const rentalsData = await RentalData.fetchRentalsByCountry();
  return rentalsData;
}

async function initializeRentalsByCountry(){
  const chartData = await fetchRentalsByCountryData();
  RentalsByCountryView.render("rentalsbycountrydiv", chartData);
}