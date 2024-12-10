import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

let EvolutionChartView = {
  render: function (containerId, chartData) {
    // Create root element
    const root = am5.Root.new(containerId);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    chart.get("colors").set("step", 3);

    // Add cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.3,
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Add series
    const series1 = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value1",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueX}: {valueY}\n{previousDate}: {value2}",
        }),
      })
    );

    series1.strokes.template.setAll({
      strokeWidth: 2,
    });

    series1.get("tooltip").get("background").set("fillOpacity", 0.5);

    const series2 = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Series 2",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value2",
        valueXField: "date",
      })
    );

    series2.strokes.template.setAll({
      strokeDasharray: [2, 2],
      strokeWidth: 2,
    });

    // Set date fields
    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX"],
    });

    // Set data for the series
    series1.data.setAll(chartData);
    series2.data.setAll(chartData);

    // Make animations on load
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);

    // Return root for potential further interaction
    return root;
  },
};

export { EvolutionChartView };
