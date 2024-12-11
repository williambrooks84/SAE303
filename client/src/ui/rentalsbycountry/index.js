import * as am5 from "@amcharts/amcharts5"; // Import necessary amCharts modules
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Function to aggregate sales by month and genre over the past 6 months
function aggregateRentalsByCountry(RentalsData) {
  return RentalsData.map((rental) => ({
    category: rental.country,
    value: parseFloat(rental.total_rentals),
  }));
}

let RentalsByCountryView = {
  render: function (containerId, RentalsData) {
    const root = am5.Root.new(containerId); // Create a new amCharts root

    const myTheme = am5.Theme.new(root); // Custom theme for styling
    myTheme.rule("AxisLabel", ["minor"]).setAll({ dy: 1 });
    myTheme.rule("Grid", ["x"]).setAll({ strokeOpacity: 0.05 });
    myTheme.rule("Grid", ["x", "minor"]).setAll({ strokeOpacity: 0.05 });

    root.setThemes([am5themes_Animated.new(root), myTheme]); // Apply themes

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    series.labels.template.setAll({
      visible: false, //Hide the labels
    });

    series.ticks.template.setAll({
      visible: false // Hides the connector lines
    });

    // Add tooltips
    series.slices.template.setAll({
      tooltipText: "{category}: {value} ({value.percent.formatNumber('#.0')}%)"
    });

    // Ensure percentages are calculated
    series.slices.template.adapters.add("tooltipText", (text, target) => {
      const percent = target.dataItem.get("valuePercentTotal");
      return `${target.dataItem.get("category")}: ${target.dataItem.get(
        "value"
      )} (${percent.toFixed(1)}%)`;
    });

    // Set data
    const aggregatedData = aggregateRentalsByCountry(RentalsData);

    // Sort data by date
    aggregatedData.sort((a, b) => a.date - b.date);

    series.data.setAll(aggregatedData);

    // Create legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      })
    );

    legend.data.setAll(series.dataItems);

    // Play initial series animation
    series.appear(1000, 100);

    const label = root.container.children.push(
      am5.Label.new(root, {
      text: "Volume des gains des locations par pays (en €)", // Set the desired static label text
      x: am5.percent(50),
      centerX: am5.percent(50),
      y: -10,
      fontSize: 16,
      fontWeight: "bold", // Set the font weight to bold
      fill: root.interfaceColors.get("text"),
      })
    );

    return root; // Return the amCharts root instance
  },
};

export { RentalsByCountryView };
