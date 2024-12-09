import { useEffect, useRef } from "react";
import { RadarChart } from "./charts";

export default function RadarChartComponent(props) {
  const { options, chartData } = props;
  const canvasRef = useRef(null);

  const translatedNames = {
    endurance: "Endurance",
    energy: "Energie",
    strength: "Force",
    speed: "Vitesse",
    intensity: "Intensité",
    cardio: "Cardio",
  }
  const dataX = Object.values(chartData.kind).map(v=>translatedNames[v]).reverse()

  useEffect(() => {
    var radarChart = new RadarChart({
      canvas: canvasRef.current,
      seriesName: options.title,
      padding: {
        x: 24,
        y: 24,
      },
      lineWidth: 2,
      dataX: dataX,
      dataY: chartData.data.map(v=>v.value).reverse(),
      colors: ["#FFFFFF"],
      font: {
        size: "12px",
        family: "Roboto",
      },
      legend: {
        show: false,
      },
      background: {
        color: "#282D30",
      },
    });
    radarChart.draw();
  }, [chartData, options.title]);

  return (
    <canvas
      id="radarChartCanvas"
      width={options.width}
      height={options.height}
      ref={canvasRef}
    ></canvas>
  );
}
