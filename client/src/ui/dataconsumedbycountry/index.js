import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Function to aggregate monthly data consumption by country
function aggregateMonthlyDataConsumption(data) {
    const result = [];
    const countries = [...new Set(data.map((entry) => entry.country))];
    const months = [...new Set(data.map((entry) => entry.month))];
  
    months.forEach((month) => {
        countries.forEach((country) => {
            const entry = data.find((d) => d.month === month && d.country === country);
  
            result.push({
                date: new Date(`${month}-01`).getTime(),
                month: month,
                country: country,
                total_data_consumed_gb: entry ? parseFloat(entry.total_data_consumed_gb) || 0 : 0,
            });
        });
    });
  
    return result;
}

let DataConsumedByCountryView = {
    render: function (containerId, data) {
        const containerElement = document.getElementById(containerId);
        if (!containerElement) {
            console.error(`Element with id ${containerId} not found in the DOM.`);
            return;
        }

        // Remove existing chart instance if present
        am5.array.each(am5.registry.rootElements, function (root) {
            if (root && root.dom && root.dom.id === containerId) {
                root.dispose();
            }
        });

        const root = am5.Root.new(containerId);
        root.setThemes([am5themes_Animated.new(root)]);

        // Use the aggregated data
        const aggregatedData = aggregateMonthlyDataConsumption(data);

        // Sort the aggregated data by date
        aggregatedData.sort((a, b) => a.date - b.date);

        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "none",
                wheelY: "none",
                paddingLeft: 0,
                layout: root.verticalLayout,
            })
        );

        // Y Axis setup
        const yRenderer = am5xy.AxisRendererY.new(root, {
            visible: false,
            minGridDistance: 20,
            inversed: true,
            minorGridEnabled: true,
        });
        yRenderer.grid.template.set("visible", false);
        const yAxis = chart.yAxes.push(
            am5xy.CategoryAxis.new(root, {
                maxDeviation: 0,
                renderer: yRenderer,
                categoryField: "country",
            })
        );

        // X Axis setup
        const xRenderer = am5xy.AxisRendererX.new(root, {
            visible: false,
            minGridDistance: 30,
            opposite: true,
            minorGridEnabled: true,
        });
        xRenderer.grid.template.set("visible", false);
        const xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                renderer: xRenderer,
                categoryField: "month",
            })
        );

        // Heat Legend
        const heatLegend = chart.bottomAxesContainer.children.push(
            am5.HeatLegend.new(root, {
                orientation: "horizontal",
                endColor: am5.color(0xfffb77),
                startColor: am5.color(0xfe131a),
            })
        );

        // Series
        const series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                calculateAggregates: true,
                stroke: am5.color(0xffffff),
                clustered: false,
                xAxis: xAxis,
                yAxis: yAxis,
                categoryXField: "month",
                categoryYField: "country",
                valueField: "total_data_consumed_gb",
            })
        );

        series.columns.template.setAll({
            tooltipText: "{value} GB",
            strokeOpacity: 1,
            strokeWidth: 2,
            width: am5.percent(100),
            height: am5.percent(100),
        });

        series.columns.template.events.on("pointerover", function (event) {
            const di = event.target.dataItem;
            if (di) {
                heatLegend.showValue(di.get("value", 0));
            }
        });

        series.events.on("datavalidated", function () {
            heatLegend.set("startValue", series.getPrivate("valueHigh"));
            heatLegend.set("endValue", series.getPrivate("valueLow"));
        });

        series.set("heatRules", [
            {
                target: series.columns.template,
                min: am5.color(0xfffb77),
                max: am5.color(0xfe131a),
                dataField: "value",
                key: "fill",
            },
        ]);

        series.data.setAll(aggregatedData);

        const countries = [];
        const months = [];
        am5.array.each(aggregatedData, function (row) {
            if (countries.indexOf(row.country) === -1) {
                countries.push(row.country);
            }
            if (months.indexOf(row.month) === -1) {
                months.push(row.month);
            }
        });

        yAxis.data.setAll(
            countries.map(function (item) {
                return { country: item };
            })
        );

        xAxis.data.setAll(
            months.map(function (item) {
                return { month: item };
            })
        );

        chart.appear(1000, 100);

        root.container.children.unshift(
            am5.Label.new(root, {
            text: "Données consommées par pays chaque mois (en Go)",
            x: am5.p50,
            centerX: am5.p50,
            y: -10, 
            fontSize: 16,
            fontWeight: "bold",
            fill: root.interfaceColors.get("text"),
            })
        );

        return root;
    },
};

export { DataConsumedByCountryView };
