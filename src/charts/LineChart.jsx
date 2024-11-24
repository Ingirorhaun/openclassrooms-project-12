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
    var lineChart = new LineChart({
      canvas: canvasRef.current,
      seriesName: options.title,
      padding: {
        x: 24,
        y: 24,
      },
      grid: {
        lineWidth: 0, // in px
      },
      lineWidth: 2,
      smooth: true,
      dataX: dataX,
      dataY: chartData.map((p) => p.sessionLength),
      colors: ["#FFFFFF"],
      font: {
        size: "14px",
        family: "Roboto",
      },
      title: {
        align: "left",
        verticalAlign: "top",
        fill: "rgba(255,255,255,0.5)",
        font: {
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
