"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function RadarChart({
  data,
  options,
}: {
  data: ChartData<"radar">;
  options?: ChartOptions<"radar">;
}) {
  return <Radar data={data} options={{ responsive: true, maintainAspectRatio: false, ...options }} />;
}
