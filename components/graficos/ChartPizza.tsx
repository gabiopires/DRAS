import React, { useEffect, useMemo, useRef } from "react";
import {
  Chart,
  registerables,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { generateDynamicColors } from "../../utils/colorUtils";

interface ChartDataSet {
  labels: string[];
  data: number[];
}

interface GraficoPizzaProps {
  data: ChartDataSet | null;
}

Chart.register(...registerables, ChartDataLabels);

const ChartPizza: React.FC<GraficoPizzaProps> = ({ data }) => {
  // Hooks SEMPRE no topo (regra de ouro)
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"doughnut"> | null>(null);

  const labels = data?.labels ?? [];
  const values = data?.data ?? [];
  const hasData = labels.length > 0;

  const colors = useMemo(() => {
    return generateDynamicColors(labels.length, 0.6);
  }, [labels.length]);

  const chartData: ChartData<"doughnut"> = useMemo(() => {
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

  const chartOptions: ChartOptions<"doughnut"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            font: { size: 14 },
          },
        },
        datalabels: {
          color: "#4B5563",
          font: {
            weight: "bold",
            size: 14,
          },
          formatter: (value: number, context) => {
            // Tipagem segura: data do dataset é (number | null)[] em alguns cenários
            const dataArr = context.chart.data.datasets?.[0]?.data ?? [];
            const total = (dataArr as Array<number | null | undefined>).reduce<number>(
                (acc, v) => acc + (typeof v === "number" ? v : 0),
                0
            );


            if (!total) return String(value);

            const percentage = ((value / total) * 100).toFixed(1) + "%";
            return `${value} - ${percentage}`;
          },
          anchor: "end",
          align: "end",
          offset: 5,
        },
      },
    };
  }, []);

  useEffect(() => {
    // Hook roda sempre, mas só cria chart se tiver dados
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
      type: "doughnut",
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

export default ChartPizza;