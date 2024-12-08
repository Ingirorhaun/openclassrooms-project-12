import { useEffect, useRef } from "react";
import { LineChart } from "./charts";

export default function LineChartComponent(props) {
  const { options, chartData } = props;
  const canvasRef = useRef(null);

  const dataX = chartData.map((p) => {
    const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];
    return dayLabels[p.day - 1];
  });

  useEffect(() => {
    const gradient = canvasRef.current
      .getContext("2d")
      .createLinearGradient(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
    const lineChart = new LineChart({
      canvas: canvasRef.current,
      seriesName: options.title,
      padding: {
        x: 24,
        y: 24,
      },
      grid: {
        lineWidth: 0,
      },
      lineWidth: 2,
      smooth: true,
      dataX: dataX,
      dataY: chartData.map((p) => p.sessionLength),
      measurementUnits: ["min"],
      colors: [gradient],
      font: {
        weight: "500",
        size: "14px",
        family: "Roboto",
      },
      title: {
        align: "left",
        verticalAlign: "top",
        fill: "rgba(255,255,255,0.5)",
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
        color: "#FF0000",
      },
    });
    lineChart.draw();
  }, [chartData, options.title]);

  return (
    <canvas
      id="lineChartCanvas"
      width={options.width}
      height={options.height}
      ref={canvasRef}
    ></canvas>
  );
}
