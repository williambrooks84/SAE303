import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

let PieView = {
  render: function (containerId, chartData) {
    const root = am5.Root.new(containerId);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270,
      })
    );

    series.states.create("hidden", {
      endAngle: -90,
    });

    series.data.setAll(chartData);
    series.appear(1000, 100);

    return root;
  },
};

export { PieView };