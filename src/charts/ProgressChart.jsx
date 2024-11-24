import { useEffect, useRef } from "react";
import { ProgressChart } from "./charts";

export default function ProgressChartComponent(props) {
  const { options, chartData } = props;
  const canvasRef = useRef(null);

  useEffect(() => {
    var progressChart = new ProgressChart({
      canvas: canvasRef.current,
      seriesName: options.title,
      padding: {
        x: 24,
        y: 24,
      },
      labelText: "de votre objectif",
      lineWidth: 10,
      data: chartData,
      colors: ["#FF0000", "#FFF"],
      font: {
        size: "26px",
        family: "Roboto",
        weight: "700",
      },
      title: {
        align: "left",
        verticalAlign: "top",
        fill: "#20253A",
        font: {
          weight: "500",
          size: "15px",
          family: "Roboto",
        },
      },
      legend: {
        show: false,
      },
      background: {
        color: "#FBFBFB",
      },
    });
    progressChart.draw();
  }, [chartData, options.title]);

  return (
    <canvas
      id="progressChartCanvas"
      width={options.width}
      height={options.height}
      ref={canvasRef}
    ></canvas>
  );
}
