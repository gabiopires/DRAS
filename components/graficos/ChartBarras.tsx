import React, { useEffect, useMemo, useRef } from "react";
import { Chart, registerables, type ChartData, type ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { generateDynamicColors } from "../../utils/colorUtils";

interface ChartDataSet {
  labels: string[];
  data: number[];
}

interface GraficoBarrasProps {
  data: ChartDataSet | null;
}

Chart.register(...registerables, ChartDataLabels);

const ChartBarras: React.FC<GraficoBarrasProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"bar"> | null>(null);

  const labels = data?.labels ?? [];
  const values = data?.data ?? [];
  const hasData = labels.length > 0;

  const colors = useMemo(() => {
    return generateDynamicColors(labels.length, 0.6);
  }, [labels.length]);

  const chartData: ChartData<"bar"> = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Número de Pacientes",
          data: values,
          borderWidth: 1,
          backgroundColor: colors.backgroundColors,
          borderColor: colors.borderColors,
        },
      ],
    };
  }, [labels, values, colors.backgroundColors, colors.borderColors]);

  const chartOptions: ChartOptions<"bar"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        datalabels: {
          color: "#4B5563",
          anchor: "end",
          align: "top",
          offset: 4,
          font: { weight: "bold", size: 14 },
          formatter: (value: number) => value.toString(),
        },
        legend: { display: true },
      },
    };
  }, []);

  useEffect(() => {
    if (!hasData) return;

    const canvas = chartRef.current;
    if (!canvas) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [hasData, chartData, chartOptions]);

  if (!hasData) {
    return (
      <p className="text-gray-500 text-center py-10">
        Dados de relatório indisponíveis.
      </p>
    );
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg"
      style={{ height: "300px" }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartBarras;