import * as am5 from "@amcharts/amcharts5"; // Import necessary amCharts modules
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Function to aggregate sales by month and genre over the past 6 months
function aggregateMonthlySalesByGenre(sales, movies) {
  const monthlySalesByGenre = {};
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // 6 months ago

  sales.forEach((sale) => {
    const purchaseDate = new Date(sale.purchase_date.date);
    const monthYear = `${purchaseDate.getFullYear()}-${purchaseDate.getMonth() + 1}`; // Format: YYYY-MM

    if (purchaseDate >= sixMonthsAgo) {
      const movie = movies.find((m) => m.id === sale.movie_id);

      if (!movie) {
        console.warn(`Movie with ID ${sale.movie_id} not found in movies dataset.`);
        return; // Skip this sale if the movie is not found
      }

      const genre = movie.genre;

      if (!monthlySalesByGenre[monthYear]) {
        monthlySalesByGenre[monthYear] = {};
      }

      if (!monthlySalesByGenre[monthYear][genre]) {
        monthlySalesByGenre[monthYear][genre] = 0; // Ensure 0€ if no sales exist
      }

      monthlySalesByGenre[monthYear][genre] += sale.purchase_price;
    }
  });

  const result = [];
  Object.entries(monthlySalesByGenre).forEach(([monthYear, genres]) => {
    Object.entries(genres).forEach(([genre, value]) => {
      result.push({
        date: new Date(`${monthYear}-01`).getTime(), // Convert month to timestamp
        genre: genre,
        value: value,
      });
    });
  });

  return result;
}

let SalesEvolutionGenreView = {
  render: function (containerId, salesData, moviesData) {
    const root = am5.Root.new(containerId); // Create a new amCharts root

    const myTheme = am5.Theme.new(root); // Custom theme for styling
    myTheme.rule("AxisLabel", ["minor"]).setAll({ dy: 1 });
    myTheme.rule("Grid", ["x"]).setAll({ strokeOpacity: 0.05 });
    myTheme.rule("Grid", ["x", "minor"]).setAll({ strokeOpacity: 0.05 });

    root.setThemes([am5themes_Animated.new(root), myTheme]); // Apply themes

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        maxTooltipDistance: 0,
        pinchZoomX: true,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: "month", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const aggregatedData = aggregateMonthlySalesByGenre(salesData, moviesData);

    // Sort data by date
    aggregatedData.sort((a, b) => a.date - b.date); 

    const genres = [...new Set(aggregatedData.map((d) => d.genre))]; // Get unique genres
    genres.forEach((genre, index) => {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: genre,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}€",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}€",
          }),
        })
      );

      // Add bullets to the series
      series.bullets.push(function () {
        var bulletCircle = am5.Circle.new(root, {
          radius: 5,
          fill: series.get("fill"), // Bullet color same as series
        });
        return am5.Bullet.new(root, {
          sprite: bulletCircle,
        });
      });

      // Filter data by genre
      const genreData = aggregatedData.filter((d) => d.genre === genre);
      series.data.setAll(genreData);
      series.appear();
    });

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );
    cursor.lineY.set("visible", false);

    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

    const legend = chart.rightAxesContainer.children.push(
      am5.Legend.new(root, {
        width: 200,
        paddingLeft: 15,
        height: am5.percent(100),
      })
    );

    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100); // Animate chart appearance

    const label = root.container.children.push(
      am5.Label.new(root, {
      text: "Evolution des ventes selon le genre sur les 6 derniers mois (en €)", // Set the desired static label text
      x: 0,
      y: -10,
      fontSize: 16,
      fontWeight: "bold", // Set the font weight to bold
      fill: root.interfaceColors.get("text"),
      })
    );

    return root; // Return the amCharts root instance
  },
};

export { SalesEvolutionGenreView };
