import { useEffect, useRef } from "react";
import { BarChart } from "./charts";

export default function BarChartComponent(props) {
  const { options, chartData } = props;
  const canvasRef = useRef(null);
  // const ctx = canvas.getContext('2d');

  useEffect(() => {
    var myBarchart = new BarChart({
      canvas: canvasRef.current,
      seriesName: options.title,
      padding: {
        x: 24,
        y: 24,
      },
      bars: {
        width: 7,
        space: 8,
        radius: 3,
      },
      grid: {
        color: "#DEDEDE",
        style: "dashed", //solid or dashed
        lineWidth: 1, // in px
        drawSeriesVerticalLine: false, // true or false
      },
      dataX: chartData.map((p) => new Date(p.day).getDate()),
      dataY: chartData.map((p) => {
        return { kilogram: p.kilogram, calories: p.calories };
      }),
      colors: ["#282d30", "#e60000"],
      font: {
        size: "14px",
        family: "Roboto",
      },
      titleOptions: {
        align: "left",
        verticalAlign: "top",
        fill: "#20253A",
        font: {
          size: "15px",
          family: "Roboto",
        },
      },
    });
    myBarchart.draw();
  }, [chartData, options.title]);

  return (
    <canvas
      id="barChartCanvas"
      width={options.width}
      height={options.height}
      ref={canvasRef}
    ></canvas>
  );
}
