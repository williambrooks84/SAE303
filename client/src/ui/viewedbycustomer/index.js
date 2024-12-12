import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function aggregateSalesByMovie(moviesData) {
  return moviesData.map((movie, index) => ({
    genre: movie.genre,
    title: movie.movie_title,
    index: index,
  }));
}

let MoviesByCustomerView = {
  render: function (containerId, moviesData) {
    am5.ready(function () {
      var existingRoot = am5.registry.rootElements.find(
        (root) => root.dom.id === containerId
      );
      if (existingRoot) {
        existingRoot.dispose();
      }
      var root = am5.Root.new(containerId); // Ensure the root is initialized with the containerId

      var mainContainer = root.container.children.push(
        am5.Container.new(root, {
          width: am5.percent(100),
          height: am5.percent(100),
          layout: root.verticalLayout,
        })
      );

      // Create a container for the label
      var labelContainer = mainContainer.children.push(
        am5.Container.new(root, {
          width: am5.percent(100),
          height: am5.percent(10),
          layout: root.horizontalLayout,
        })
      );

      // Create a container for the chart
      var chartContainer = mainContainer.children.push(
        am5.Container.new(root, {
          width: am5.percent(100),
          height: am5.percent(90),
          layout: root.verticalLayout,
        })
      );

      // Apply only for this chart
      root.setThemes([am5themes_Animated.new(root)]);

      // Process data
      const aggregatedData = aggregateSalesByMovie(moviesData);
      const genreMovieMap = {};

      aggregatedData.forEach((movie) => {
        if (!genreMovieMap[movie.genre]) {
          genreMovieMap[movie.genre] = { name: movie.genre, children: [] };
        }
        genreMovieMap[movie.genre].children.push({
          name: movie.title,
          value: 1,
        });
      });

      const treeData = {
        children: Object.values(genreMovieMap),
      };

      // Create series
      var series = chartContainer.children.push(
        am5hierarchy.ForceDirected.new(root, {
          singleBranchOnly: false,
          downDepth: 1,
          topDepth: 1,
          initialDepth: 2, // Adjust initial depth as needed
          valueField: "value",
          categoryField: "name",
          childDataField: "children",
          manyBodyStrength: -20,
          centerStrength: 0.8,
          linkWithField: "name", // Link genres based on their names
          nodeSizeField: "value", // Control node size based on value
          minRadius: 30, // Minimum node size
          maxRadius: 60, // Maximum node size
        })
      );

      // Set colors for genres
      series.get("colors").setAll({
        step: 2,
      });

      series.data.setAll([treeData]);

      // Animate appearance
      series.appear(1000, 100);

      // Add the label to the label container
      labelContainer.children.push(
        am5.Label.new(root, {
          text: "Tous les films qu'un client sélectionné a visualisé (acheté ou loué) :",
          x: am5.percent(50),
          centerX: am5.percent(50),
          fontSize: 16,
          fontWeight: "bold",
          fill: root.interfaceColors.get("text"),
        })
      );
    });
  },
};

export { MoviesByCustomerView };
