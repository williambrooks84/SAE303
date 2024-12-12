import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function aggregateMonthlyRentalsByMovie(rentalsData) {
  const result = [];
  const movies = [...new Set(rentalsData.map((rental) => rental.movie))];
  const months = [...new Set(rentalsData.map((rental) => rental.month))];

  months.forEach((month) => {
    movies.forEach((movie) => {
      const rental = rentalsData.find((rental) => rental.month === month && rental.movie === movie);
      result.push({
        date: new Date(`${month}-01`).getTime(),
        movie: movie,
        total_rentals_eur: rental ? parseFloat(rental.total_rentals_eur) || 0 : 0,
      });
    });
  });

  return result;
}

let RentalsEvolutionByMovieView = {
  render: function (containerId, rentalsData, moviesData) {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root.dom && root.dom.id && root.dom.id === containerId) {
        root.dispose();
      }
    });

    const root = am5.Root.new(containerId);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "month", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
          minorGridEnabled: true,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
        min: 0,
      })
    );

    const aggregatedData = aggregateMonthlyRentalsByMovie(rentalsData, moviesData);

    aggregatedData.sort((a, b) => a.date - b.date);

    const genres = [...new Set(aggregatedData.map((d) => d.genre))];
    genres.forEach((genre) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: genre,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "total_rentals_eur",
          valueXField: "date",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}€",
          }),
        })
      );

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
      series.columns.template.adapters.add("fill", function (_, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", function (_, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

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

    chart.appear(1000, 100);

    root.container.children.push(
      am5.Label.new(root, {
        text: "Evolution des locations d'un film sur les 6 derniers mois (en €)",
        x: 0,
        y: -10,
        fontSize: 16,
        fontWeight: "bold",
        fill: root.interfaceColors.get("text"),
      })
    );

    return root;
  },
};

export { RentalsEvolutionByMovieView };
