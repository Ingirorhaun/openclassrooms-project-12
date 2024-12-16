import { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * RadarChart Component - Renders a radar chart using D3.js
 * @param {Object} options - Configuration options for the chart (width, height, title)
 * @param {Object} chartData - Data for the radar chart
 * @returns {JSX.Element} - The rendered RadarChartComponent
 */
export default function RadarChartComponent({ options, chartData }) {
  const ref = useRef(null);

  const translatedNames = {
    3: "Endurance",
    2: "Energie",
    4: "Force",
    5: "Vitesse",
    6: "Intensité",
    1: "Cardio",
  };

  const data = chartData.data
    .map((v) => {
      return { name: translatedNames[v.kind], value: v.value };
    })
    .reverse();

  const margin = {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  };
  const width = options.width - margin.left - margin.right;
  const height = options.height - margin.top - margin.bottom;

  const sides = new Set(data.map((item) => item.name)).size;

  const levels = 5; //number of concentric polygons to draw
  const size = Math.min(options.width, options.height);
  const offset = Math.PI; // used to rotate the entire chart so the first point starts at the top
  const polyAngle = (2 * Math.PI) / sides;
  const r = 0.7 * size; //distance between center and edge of the drawing area
  const r_0 = r / 2; //max distance from center to edge of outermost polygon

  useEffect(() => {
    //remove any existing element
    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", size)
      .attr("height", size);

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left + width / 2}, ${margin.top + height / 2})`
      );

    const highestValue = Math.max(...data.map((d) => d.value));
    const scale = d3
      .scaleLinear()
      .domain([0, highestValue])
      .range([0, r_0])
      .nice();

    /**
     * Converts polar coordinates (length and angle) to Cartesian coordinates (x,y)
     * @param {Object} params - Object containing length and angle parameters
     * @param {number} params.length - The distance from the center (radius)
     * @param {number} params.angle - The angle in radians
     * @returns {Object} - Returns {x, y} coordinates for the point
     */
    function generatePoint({ length, angle }) {
      const point = {
        // Calculate x coordinate:
        // Using sine function and adjusting by offset (Math.PI)
        x: length * Math.sin(offset - angle),
        y: length * Math.cos(offset - angle),
      };
      return point;
    }

    function drawPath(points, parent) {
      const lineGenerator = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y);

      parent.append("path").attr("d", lineGenerator(points));
    }

    /**
     * Draws concentric polygons representing different levels of the radar chart
     * @param {number} levelsCount - The number of concentric levels to draw
     * @param {number} sideCount - The number of sides in the polygon (number of data points)
     */
    function drawLevels(levelsCount, sideCount) {
      for (let level = 1; level <= levelsCount; level++) {
        // Calculate the radius (hypotenuse) for current level
        // r_0 is the maximum radius, and we scale it based on current level
        const hypotenuse = (level / levelsCount) * r_0;

        const points = [];
        for (let vertex = 0; vertex < sideCount; vertex++) {
          const angle = vertex * polyAngle;

          points.push(generatePoint({ length: hypotenuse, angle: angle }));
        }
        const group = g.append("g").attr("class", "level");
        // Draw the polygon by connecting all points
        // Add first point again at end to close the shape
        drawPath([...points, points[0]], group);
      }
    }

    /**
     * Draws text labels at specified points on the radar chart
     * @param {string} text - The text to be displayed
     * @param {Object} point - The coordinates {x, y} where the text should be placed
     * @param {Object} group - The SVG group element to append the text to
     */
    function drawText(text, point, group) {
      //change the text anchor according to whether the point is
      // closer to the right or left edge of the drawing area
      const threshold = 0; //the horizontal center
      const errorMargin = 0.05 * width;
      let textAnchor = "middle";
      if (point.x > threshold + errorMargin) {
        textAnchor = "start";
      } else if (point.x < threshold - errorMargin) {
        textAnchor = "end";
      }

      //add some vertical offset to the text if it's in the middle
      if (textAnchor === "middle") {
        point.y += 0.05 * point.y;
      }

      group
        .append("text")
        .attr("x", point.x)
        .attr("y", point.y)
        .html(text)
        .style("text-anchor", textAnchor);
    }

    /**
     * Draws the actual data shape (polygon) representing the data values on the radar chart
     * @param {Array} dataset - Array of data objects containing name and value properties
     * @param {number} n - Number of sides/points in the radar chart
     */
    function drawDataShape(dataset, n) {
      const points = [];
      dataset.forEach((d, i) => {
        // Scale the data value to fit within the chart dimensions
        const len = scale(d.value);

        // Calculate the angle for this point
        // Divides the circle (2π) into n equal segments
        const angle = i * ((2 * Math.PI) / n);

        points.push({
          ...generatePoint({ length: len, angle: angle }),
        });
      });

      const group = g.append("g").attr("class", "shape");

      // Draw the data shape by connecting all points
      // Add first point again at end to close the shape
      drawPath([...points, points[0]], group);
    }

    /**
     * Draws the axis labels around the radar chart
     * @param {Array} dataset - Array of data objects containing name and value properties
     * @param {number} sideCount - Number of sides/dimensions in the radar chart
     */
    function drawLabels(dataset, sideCount) {
      const groupL = g.append("g").attr("class", "labels");
      for (let vertex = 0; vertex < sideCount; vertex++) {
        const angle = vertex * polyAngle;
        const label = dataset[vertex].name;
        // Calculate the position for the label
        // Uses 75% of half the chart size (size/2) as the distance from center
        // This places labels slightly outside the main chart area
        const point = generatePoint({
          length: 0.75 * (size / 2),
          angle: angle,
        });

        drawText(label, point, groupL);
      }
    }

    drawLevels(levels, sides);
    drawDataShape(data, sides);
    drawLabels(data, sides);
  }, [chartData, options.title]);

  return <div id="radarChart" ref={ref}></div>;
}
