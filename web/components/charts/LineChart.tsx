"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export function LineChart({
  data,
  options,
}: {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}) {
  return <Line data={data} options={{ responsive: true, maintainAspectRatio: false, ...options }} />;
}
