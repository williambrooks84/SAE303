import { HeaderView } from "./ui/header/index.js";
import { PieView } from "./ui/pie/index.js";
import { SalesCounterView } from "./ui/salescounter/index.js";
import { RentalsCounterView } from "./ui/rentalscounter/index.js";
import { TopPurchasesView } from "./ui/toppurchases/index.js";
import { TopRentalsView } from "./ui/toprentals/index.js";
import { CustomerData } from "./data/customers.js";
import { SaleData } from "./data/sales.js";
import { RentalData } from "./data/rentals.js";
import { MovieData } from "./data/movies.js";
import { SalesEvolutionView } from "./ui/salesevolutionchart/index.js";
import { RentalsEvolutionView } from "./ui/rentalsevolutionchart/index.js";
import { SalesEvolutionGenreView } from "./ui/salesevolutiongenrechart/index.js";
import { RentalsEvolutionGenreView } from "./ui/rentalsevolutiongenrechart/index.js";
import { SalesByCountryView } from "./ui/salesbycountry/index.js";
import { RentalsByCountryView } from "./ui/rentalsbycountry/index.js";
import { SalesEvolutionByMovieView } from "./ui/salesevolutionmoviechart/index.js";
import { RentalsEvolutionByMovieView } from "./ui/rentalsevolutionmoviechart/index.js";
import { MoviesByCustomerView } from "./ui/viewedbycustomer/index.js";

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
  initializeRentalsByCountry();
  initializeMovies();
  initializeCustomers();
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

//Itération 8

async function fetchMovies(){
  const moviesData = await MovieData.fetchAll();
  return moviesData;
}

async function initializeMovies() {
  const moviesData = await fetchMovies();
  renderMovieList(moviesData);

  const defaultSalesMovieId = document.getElementById("movieFilterSales").value;
  const defaultRentalsMovieId = document.getElementById("movieFilterRentals").value;

  initializeSalesByMovie(defaultSalesMovieId);
  initializeRentalsByMovie(defaultRentalsMovieId);
}

function renderMovieList(moviesData) {
  const movieFilterSales = document.getElementById("movieFilterSales");
  const movieFilterRentals = document.getElementById("movieFilterRentals");
  movieFilterSales.innerHTML = "";
  movieFilterRentals.innerHTML = "";

  moviesData.forEach(movie => {
    const optionSales = document.createElement("option");
    optionSales.value = movie.id;
    optionSales.textContent = movie.movie_title;
    movieFilterSales.appendChild(optionSales);

    const optionRentals = document.createElement("option");
    optionRentals.value = movie.id;
    optionRentals.textContent = movie.movie_title;
    movieFilterRentals.appendChild(optionRentals);
  });
}

async function fetchSalesByMovieData(){
  let idMovie = document.getElementById("movieFilterSales").value;
  const salesData = await SaleData.fetchSalesByMovieID(idMovie);
  return salesData;
}

async function initializeSalesByMovie(idMovie) {
  const chartData = await fetchSalesByMovieData(idMovie);
  SalesEvolutionByMovieView.render("salesbymoviediv", chartData);
}

async function fetchRentalsByMovieData(){
  let idMovie = document.getElementById("movieFilterRentals").value;
  const rentalsData = await RentalData.fetchRentalsByMovieID(idMovie);
  return rentalsData;
}

async function initializeRentalsByMovie(idMovie) {
  const chartData = await fetchRentalsByMovieData(idMovie);
  RentalsEvolutionByMovieView.render("rentalsbymoviediv", chartData);
}

document.getElementById("movieFilterSales").addEventListener("change", function() {
  const selectedMovieId = this.value;
  initializeSalesByMovie(selectedMovieId);
});

document.getElementById("movieFilterRentals").addEventListener("change", function() {
  const selectedMovieId = this.value;
  initializeRentalsByMovie(selectedMovieId);
});

//Itération 9

async function fetchCustomers(){
  const customersData = await CustomerData.fetchAll();
  return customersData;
}

async function fetchMoviesByCustomerData(customerId){
  const moviesData = await CustomerData.fetchMoviesByCustomerID(customerId);
  console.log(moviesData);
  return moviesData;
}

async function initializeCustomers() {
  const customersData = await fetchCustomers();
  renderCustomerList(customersData);

  const defaultCustomerId = document.getElementById("customerList").value;
  initializeMoviesByCustomer(defaultCustomerId);
}

function renderCustomerList(customersData) {
  const customerList = document.getElementById("customerList");
  customerList.innerHTML = "";

  customersData.forEach(customer => {
    const option = document.createElement("option");
    option.value = customer.id;
    option.textContent = `${customer.firs_name} ${customer.last_name}`;
    customerList.appendChild(option);
  });
}

document.getElementById("customerList").addEventListener("change", function() {
  const selectedCustomerId = this.value;
  initializeMoviesByCustomer(selectedCustomerId);
});

async function initializeMoviesByCustomer(customerId) {
  console.log('Fetching movies for customer ID:', customerId);
  const moviesData = await fetchMoviesByCustomerData(customerId);
  console.log("Movies data received:", moviesData); // Log to verify data
  MoviesByCustomerView.render("moviesbycustomerdiv", moviesData); // Ensure this is correctly rendered
}

document.getElementById("customerList").addEventListener("change", function() {
  const selectedCustomerId = this.value;
  initializeMoviesByCustomer(selectedCustomerId);
});