import { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * ProgressChart Component - Renders a radial progress chart using D3.js
 * @param {Object} options - Configuration options for the chart (width, height, title)
 * @param {Number} chartData - The progress value to be displayed (between 0 and 1)
 * @returns {JSX.Element} - The rendered ProgressChartComponent
 */
export default function ProgressChartComponent(props) {
  const { options, chartData } = props;
  const ref = useRef(null);

  const margin = {
    top: 40,
    left: 30,
  };
  const circleRadius = 87;
  const arcThickness = 10;
  const progress = chartData;

  useEffect(() => {
    // Remove any existing element
    d3.select(ref.current).selectAll("*").remove();

    // Create main svg container
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", options.width)
      .attr("height", options.height);

    // Draw background circle
    svg
      .append("circle")
      .attr("class", "bg-circle")
      .attr("cx", options.width / 2)
      .attr("cy", options.height / 2)
      .attr("r", circleRadius);

    // Draw arc around the background circle, counterclockwise starting from top
    svg
      .append("path")
      .attr("class", "progress-arc")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(circleRadius)
          .outerRadius(circleRadius + arcThickness)
          .cornerRadius(arcThickness)
          .startAngle(0)
          //calculate end angle based on progress
          .endAngle(progress * -Math.PI * 2)
      )
      .attr(
        "transform",
        `translate(${options.width / 2}, ${options.height / 2})`
      );

    // Draw chart title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .text(options.title);

    // Draw progress text at the center of the chart
    svg
      .append("text")
      .attr("class", "progress-text")
      .attr("x", options.width / 2)
      .attr("y", options.height / 2 - 13) //subtract half line height
      .attr("text-anchor", "middle")
      .text(`${progress * 100}%`);

    // Add "de votre" text
    svg
      .append("text")
      .attr("class", "progress-subtext")
      .attr("x", options.width / 2)
      .attr("y", options.height / 2 + 15) // Position below the percentage
      .attr("text-anchor", "middle")
      .text("de votre");

    // Add "objectif" text
    svg
      .append("text")
      .attr("class", "progress-subtext")
      .attr("x", options.width / 2)
      .attr("y", options.height / 2 + 40) // Position below "de votre"
      .attr("text-anchor", "middle")
      .text("objectif");
    
  }, [chartData, options.title]);

  return <div id="progressChart" ref={ref}></div>;
}
