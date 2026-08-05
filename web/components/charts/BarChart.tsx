"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function BarChart({
  data,
  options,
}: {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
}) {
  return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, ...options }} />;
}
