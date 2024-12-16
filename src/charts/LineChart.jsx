import { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * LineChart Component - Renders a line chart using D3.js
 * @param {Object} options - Configuration options for the chart (width, height, title)
 * @param {Array} chartData - Array of data points containing day and sessionLength
 * @returns {JSX.Element} - The rendered LineChartComponent
 */
export default function LineChartComponent({ options, chartData }) {
  const ref = useRef(null);
  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

  //format input data
  const data = chartData.map((p) => {
    return { x: p.day, y: p.sessionLength };
  });

  const margin = {
    top: 80,
    right: 0,
    bottom: 50,
    left: 0,
  };
  const width = options.width - margin.left - margin.right;
  const height = options.height - margin.top - margin.bottom;

  useEffect(() => {
    //remove any existing element
    d3.select(ref.current).selectAll("*").remove();
    // Create the main svg element
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create the semi transparent highlight rectangle
    const highlightRect = svg
      .append("rect")
      .attr("class", "highlight-overlay")
      .attr("height", options.height)
      .attr("y", 0 - margin.top)
      .attr("opacity", 0);

    // Add X scale for the chart line
    const xLine = d3
      .scalePoint()
      .domain(data.map((i) => i.x))
      .range([0, width]);

    // Add X axis
    const xAxis = d3
      .scalePoint()
      .domain(data.map((i) => i.x))
      .range([width * 0.07, width * 0.93]);
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xAxis).tickFormat((d, i) => dayLabels[i]))
      .selectAll("text")
      .attr("dy", "20px");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, Math.max(...data.map((i) => i.y))])
      .range([height, 0]);

    // Create a circle that travels along the curve of chart on hover
    const focusCircle = svg.append("g").style("opacity", 0);

    //outer circle
    focusCircle
      .append("circle")
      .attr("class", "focus-circle-outer")
      .attr("r", 9)
      .attr("cx", 0)
      .attr("cy", 0);

    //inner circle
    focusCircle
      .append("circle")
      .attr("class", "focus-circle-inner")
      .attr("r", 4)
      .attr("cx", 0)
      .attr("cy", 0);

    // Create the tooltip element
    const tooltipBgHeight = 25;
    const tooltipBgWidth = 39;
    const tooltip = svg
      .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Add tooltip background
    const tooltipBG = tooltip
      .append("rect")
      .attr("class", "tooltip-bg")
      .attr("width", tooltipBgWidth)
      .attr("height", tooltipBgHeight)
      .attr("x", -tooltipBgWidth / 2 + 15)
      .attr("y", -tooltipBgHeight / 2 - 20);

    // Add tooltip text
    const tooltipText = tooltip
      .append("text")
      .attr("class", "tooltip-text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", 15)
      .attr("y", -20);

    // Create gradient definition for the line (css gradients don't work on svg)
    svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%")
      .selectAll("stop")
      .data([
        { offset: "1.19%", color: "#FFFFFF" },
        { offset: "81.27%", color: "rgba(255, 255, 255, 0.4)" },
      ])
      .enter()
      .append("stop")
      .attr("offset", function (d) {
        return d.offset;
      })
      .attr("stop-color", function (d) {
        return d.color;
      });

    // Draw the chart line
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return xLine(d.x);
          })
          .y(function (d) {
            return y(d.y);
          })
          .curve(d3.curveCatmullRom)
      );

    // Add chart title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr(
        "transform",
        `translate(${0 - margin.left + 34}, ${0 - margin.top + 46})`
      )
      // Manually add line breaks
      .append("tspan")
      .text(options.title.split(" ").slice(0, 3).join(" ")) // First line
      .attr("x", 0)
      .attr("dy", 0)
      .append("tspan")
      .text(options.title.split(" ").slice(3).join(" ")) // Second line
      .attr("x", 0)
      .attr("dy", "1.2em"); // Vertical spacing between lines

    // Create an invisible rect on top of the svg area to handle mouse interactions
    svg
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", mouseover) //triggers when the mouse pointer enters an element or any of its children
      .on("mousemove", mousemove) //triggers each time the mouse pointer is moved when it is over an element
      .on("mouseout", mouseout);

    function mouseover() {
      focusCircle.style("opacity", 1);
      tooltip.style("opacity", 1);
      highlightRect.style("opacity", 1);
    }

    function mousemove(e) {
      // Calculate the nearest data point based on mouse position
      const xPos = d3.pointer(e)[0];
      const domain = xAxis.domain();
      const range = xAxis.range();
      const rangePoints = d3.range(range[0], range[1], xAxis.step());

      // Handle edge case for last point
      let index;
      let xOffset = 15;
      if (xPos >= range[1]) {
        // If we're at or beyond the last point, select the last point
        index = domain.length - 1;
        xOffset = -50;
      } else {
        // Otherwise get the right point
        index = d3.bisectRight(rangePoints, xPos) - 1;
      }
      const yPos = domain[index];

      const selectedData = data.find((d) => d.x === yPos);

      if (selectedData) {
        focusCircle.attr(
          "transform",
          `translate(${xLine(selectedData.x)},${y(selectedData.y)})`
        );
        tooltip.attr(
          "transform",
          `translate(${xLine(selectedData.x) + xOffset},${y(selectedData.y)})`
        );
        tooltipText.text(selectedData.y + " min");

        // Adjust highlight rect size and position
        highlightRect
          .attr("x", xLine(selectedData.x))
          .attr("width", width - xLine(selectedData.x));
      }
    }

    function mouseout() {
      focusCircle.style("opacity", 0);
      tooltip.style("opacity", 0);
      highlightRect.style("opacity", 0);
    }
  }, [chartData, options.title]);

  return <div id="lineChart" ref={ref}></div>;
}
