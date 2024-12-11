import * as am5 from "@amcharts/amcharts5"; // Import necessary amCharts modules
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Function to aggregate sales by month and genre over the past 6 months
function aggregateMonthlySalesByGenre(salesData) {
  const result = [];
  const genres = [...new Set(salesData.map((sale) => sale.genre))];
  const months = [...new Set(salesData.map((sale) => sale.month))];

  months.forEach((month) => {
    genres.forEach((genre) => {
      const sale = salesData.find((sale) => sale.month === month && sale.genre === genre);
      result.push({
        date: new Date(`${month}-01`).getTime(), // Convert month to timestamp
        genre: genre,
        value: sale ? parseFloat(sale.total_sales) : 0, // Set value to 0 if no sales
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
