import { useEffect, useRef } from "react";
import * as d3 from "d3";

// Returns path data for a rectangle with rounded top corners
function upperRoundedRect(x, y, width, height, radius) {
  return (
    "M" +
    x +
    "," +
    (y + height) +
    "v" +
    (-height + radius) +
    "a" +
    radius +
    "," +
    radius +
    " 0 0 1 " +
    radius +
    "," +
    -radius +
    "h" +
    (width - radius * 2) +
    "a" +
    radius +
    "," +
    radius +
    " 0 0 1 " +
    radius +
    "," +
    radius +
    "v" +
    (height - radius) +
    "z"
  );
}

const BarChartComponent = ({ options, chartData }) => {
  const ref = useRef(null);

  //initialize variables
  const data = chartData.map((d) => ({
    day: new Date(d.day).getDate(),
    kilogram: d.kilogram,
    calories: d.calories,
  }));
  const margin = {
    top: 112,
    right: 70,
    bottom: 70,
    left: 50,
  };
  const width = options.width - margin.left - margin.right;
  const height = options.height - margin.top - margin.bottom;
  const barWidth = 7;
  const gap = 8;
  const legendSpacing = 52;

  var color = d3
    .scaleOrdinal()
    .domain(["Poids (kg)", "Calories brûlées (kCal)"])
    .range(["#282D30", "#E60000"]);

  // Set x and y scales
  const xScale = d3
    .scalePoint()
    .range([0, width])
    .padding(0.0135 * data.length);
  const yScale = d3.scaleLinear().range([height, 0]);

  useEffect(() => {
    //remove any existing element
    d3.select(ref.current).selectAll("*").remove();
    // Create svg object
    var svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //create the tooltip element
    const tooltip = d3
      .select("#barChart")
      .append("div")
      .attr("class", "tooltip");

    //scale axis based on data
    xScale.domain(data.map((d) => d.day));
    yScale.domain([
      0,
      Math.max(...data.flatMap((d) => [d.kilogram, d.calories])),
    ]);

    //draw horizontal grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data([yScale.domain()[1] / 2, yScale.domain()[1]])
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d));

    //draw bars
    const space = (width - barWidth * 2 - gap) / (data.length - 1);

    // Create groups for pairs of bars
    const barGroups = svg
      .selectAll(".bar-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d, i) => `translate(${i * space}, 0)`);

    // Add a transparent background rect to each group and set up mouseover events
    
    barGroups
      .append("rect")
      .attr("class", "hover-area")
      .attr("x", -20)
      .attr("y", 0)
      .attr("width", barWidth * 2 + gap + 40)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .style("pointer-events", "none")
          .html(`${d.kilogram}kg<br/>${d.calories}kCal`)
          .style("left", () => {
            const hoverArea = d3.select(this).node().getBoundingClientRect();
            return (hoverArea.x + hoverArea.width) + 10 + "px";
          })
          .style("top", event.pageY - 30 + "px");
          //change the rect color
        d3.select(this.parentNode)
          .select(".hover-area")
          .attr("fill", "rgba(196, 196, 196, 0.5)");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
        d3.select(this.parentNode)
          .select(".hover-area")
          .attr("fill", "transparent");
      });

    // Add the kilogram bars to each group
    barGroups
      .append("path")
      .attr("d", function (d) {
        return upperRoundedRect(
          0,
          yScale(d.kilogram),
          barWidth,
          height - yScale(d.kilogram),
          3
        );
      })
      .style("fill", color("Poids (kg)"));

    // Add the calories bars to each group
    barGroups
      .append("path")
      .attr("d", function (d) {
        return upperRoundedRect(
          gap + barWidth,
          yScale(d.calories),
          barWidth,
          height - yScale(d.calories),
          3
        );
      })
      .style("fill", color("Calories brûlées (kCal)"));

    // Add X axis at bottom of chart
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .attr("dy", "20px");

    // Add y axis
    svg
      .append("g")
      .attr("transform", `translate(${width + 20},0)`)
      .attr("class", "y-axis")
      .call(
        d3
          .axisRight(yScale)
          .tickValues([
            yScale.domain()[0],
            yScale.domain()[1] / 2,
            yScale.domain()[1],
          ])
      );

    // Add chart title
    svg
      .append("text")
      .text(options.title)
      .attr("class", "chart-title")
      .attr(
        "transform",
        `translate(${0 - margin.left + 42}, ${0 - margin.top + 42})`
      );

    // ==== Add legend
    const legend = svg
      .selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend");

    legend
      .append("text")
      .text((d) => d)
      .each(function (d, i) {
        const textWidth = this.getBoundingClientRect().width;
        const xPosition =
          width -
          textWidth +
          50 -
          (color.domain().length - 1 - i) * 2 * textWidth -
          (color.domain().length - 1 - i) * legendSpacing;
        const yPosition = 0 - margin.top + 42;
        //adjust position based on textWidth
        d3.select(this).attr(
          "transform",
          `translate(${xPosition}, ${yPosition})`
        );
        //Move the rect creation out of the each() function by selecting the parent node
        d3.select(this.parentNode)
          .append("rect")
          .attr("width", 8)
          .attr("height", 8)
          .attr("rx", 10)
          .attr("ry", 10)
          .style("fill", color)
          .attr("transform", `translate(${xPosition - 14}, ${yPosition - 9})`);
      });
  }, [chartData]);

  return <div id="barChart" ref={ref}></div>;
};
export default BarChartComponent;
