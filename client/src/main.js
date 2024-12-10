import { HeaderView } from "./ui/header/index.js";
import { PieView } from "./ui/pie/index.js";
import { SalesCounterView } from "./ui/salescounter/index.js";
import { RentalsCounterView } from "./ui/rentalscounter/index.js";
import { TopPurchasesView } from "./ui/toppurchases/index.js";
import { SaleData } from "./data/sales.js";
import { RentalData } from "./data/rentals.js";
import { MovieData } from "./data/movies.js";

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
  toppurchases: document.querySelector("#toppurchases")
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
  topMovies();
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

async function topMovies() {
  try {
    const currentDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(currentDate.getMonth() - 1);
  
    const salesResponse = await SaleData.fetchAll(); 

    if (!salesResponse || !Array.isArray(salesResponse) || salesResponse.length === 0) {
      console.error('Error: Invalid or empty sales data.');
      return;
    }

    const filteredSales = salesResponse.filter(sale => {
      const purchaseDate = new Date(sale.purchase_date.date);
      return purchaseDate >= lastMonthDate;
    });

    const totalSales = filteredSales.reduce((acc, sale) => {
      return acc + sale.purchase_price;
    }, 0);

    const salesMap = filteredSales.reduce((acc, sale) => {
      const movieId = sale.movie_id;
      const price = sale.purchase_price;

      if (!acc[movieId]) {
        acc[movieId] = 0;
      }

      acc[movieId] += price;
      return acc;
    }, {});

    const sortedMovieIds = Object.entries(salesMap)
      .sort((a, b) => b[1] - a[1]) 
      .slice(0, 3) 
      .map(entry => entry[0]);

    const moviesResponse = await MovieData.fetchAll(); 

    if (!moviesResponse || !Array.isArray(moviesResponse) || moviesResponse.length === 0) {
      console.error('Error: Invalid or empty movie data.');
      return;
    }

    const topMovies = sortedMovieIds.map(movieId => {
      const movie = moviesResponse.find(m => m.id == movieId); 
      return movie ? movie.movie_title : null; 
    }).filter(title => title !== null); 

    if (topMovies.length < 3) {
      console.error('Not enough top movies found.');
      return;
    }

    const toppurchasesElement = document.querySelector('#toppurchases');

    if (!toppurchasesElement) {
      console.error('Error: Element .toppurchases not found in the DOM.');
      return; 
    }

    let TopSalesHTML = TopPurchasesView.render(totalSales.toFixed(2));

    let finalHTML = TopSalesHTML
      .replace("{{movie1}}", topMovies[0])
      .replace("{{movie2}}", topMovies[1])
      .replace("{{movie3}}", topMovies[2]);

    toppurchasesElement.innerHTML = finalHTML;

  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

