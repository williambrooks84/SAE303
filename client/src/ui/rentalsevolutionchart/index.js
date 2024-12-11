import * as am5 from "@amcharts/amcharts5"; // Import necessary amCharts modules
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Function to aggregate sales by month over the past 6 months
function aggregateMonthlyRentals(data) {
  const monthlyRentals = {};
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // 6 months ago

  data.forEach((item) => {
    const rentalDate = item.rental_date
      ? new Date(item.rental_date.date)
      : new Date(); // Parse rental date
    const monthYear = `${rentalDate.getFullYear()}-${
      rentalDate.getMonth() + 1
    }`; // Format: YYYY-MM

    // Only include data from the past 6 months
    if (rentalDate >= sixMonthsAgo) {
      if (monthlyRentals[monthYear]) {
        monthlyRentals[monthYear] += item.rental_price; // Sum rentals for each month
      } else {
        monthlyRentals[monthYear] = item.rental_price; // Initialize sales if not present
      }
    }
  });

  return Object.entries(monthlyRentals).map(([key, value]) => ({
    // Format and return the aggregated data
    date: new Date(key).getTime(), // Convert date to timestamp
    value: value, // Sales value
  }));
}

let RentalsEvolutionView = {
  render: function (containerId, chartData) {
    const root = am5.Root.new(containerId); // Create a new amCharts root

    const myTheme = am5.Theme.new(root); // Custom theme for styling
    myTheme.rule("AxisLabel", ["minor"]).setAll({ dy: 1 }); // Customize minor axis labels
    myTheme.rule("Grid", ["minor"]).setAll({ strokeOpacity: 0.08 }); // Customize minor grid opacity

    root.setThemes([am5themes_Animated.new(root), myTheme]); // Apply themes

    const chart = root.container.children.push(
      // Create XYChart
      am5xy.XYChart.new(root, {
        panX: false, // Disable panning on X-axis
        panY: false, // Disable panning on Y-axis
        wheelX: "panX", // Enable zooming on X-axis via wheel
        wheelY: "zoomX", // Enable zooming on X-axis via wheel
        paddingLeft: 2, // Padding for layout
      })
    );

    const cursor = chart.set(
      // Add cursor for interaction
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX", // Zoom on X-axis only
      })
    );
    cursor.lineY.set("visible", false); // Hide vertical line from cursor

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0, // Prevent deviation
        baseInterval: { timeUnit: "month", count: 1 }, // Monthly intervals
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
          minGridDistance: 150, // Set grid distance to avoid overlapping
          minorLabelsEnabled: true,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xAxis.set("dateFormats", {
      month: "MM/yyyy", // Consistent date format
    });

    chartData.sort((a, b) => a.date - b.date); // Sort data by date

    cursor.lineY.set("visible", false); // Hide vertical cursor line

    // Optional: Hide zoom-out button
    chart.zoomOutButton.set("forceHidden", true);

    const yAxis = chart.yAxes.push(
      // Configure Value Axis for sales
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}), // Basic renderer
      })
    );

    // Line series for displaying sales data
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Sales",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}", // Display sales value on tooltip
        }),
      })
    );

    // Bullet for data points (circles)
    series.bullets.push(function () {
      var bulletCircle = am5.Circle.new(root, {
        radius: 4,
        fill: series.get("fill"), // Bullet color same as series
      });
      return am5.Bullet.new(root, {
        sprite: bulletCircle,
      });
    });

    chart.set(
      // Add horizontal scrollbar
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      })
    );

    if (chartData && chartData.length > 0) {
      // Check if there is data to display
      chartData = aggregateMonthlyRentals(chartData); // Aggregate data by month
      chartData.sort((a, b) => a.date - b.date); // Sort data by date
      series.data.setAll(chartData); // Set the aggregated data
      series.appear(1000); // Animate series appearance
      chart.appear(1000, 100); // Animate chart appearance
    } else {
      console.warn("No rentals data available to render the chart."); // Warn if no data
    }

    const label = root.container.children.push(
      am5.Label.new(root, {
      text: "Evolution des locations sur les 6 derniers mois (en €)", // Set the desired static label text
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

export { RentalsEvolutionView };
