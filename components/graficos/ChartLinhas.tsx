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

// Registro único (OK ficar no módulo)
Chart.register(...registerables, ChartDataLabels);

const ChartLinhas: React.FC<GraficoBarrasProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"line"> | null>(null);

  const hasData = !!data && data.labels.length > 0;

  // Cores (memoizadas) — só recalcula quando mudar o número de labels
  const colors = useMemo(() => {
    const n = data?.labels.length ?? 0;
    return generateDynamicColors(n, 0.6);
  }, [data?.labels.length]);

  // chartData e chartOptions memoizados (resolve exhaustive-deps de forma correta)
  const chartData: ChartData<"line"> = useMemo(() => {
    return {
      labels: data?.labels ?? [],
      datasets: [
        {
          label: "Número de Pacientes",
          data: data?.data ?? [],
          borderWidth: 1,
          backgroundColor: colors.backgroundColors,
          borderColor: colors.borderColors,
        },
      ],
    };
  }, [data?.labels, data?.data, colors.backgroundColors, colors.borderColors]);

  const chartOptions: ChartOptions<"line"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 40,
          title: { display: true, text: "Vendas (unidades)" },
        },
        x: {
          title: { display: true, text: "Mês" },
        },
      },
      plugins: {
        datalabels: {
          color: "#4B5563",
          anchor: "end",
          align: "top",
          offset: 8,
          font: { weight: "bold", size: 14 },
          formatter: (value: number) => value.toString(),
        },
        legend: {
          display: true,
          position: "top",
        },
      },
    };
  }, []);

  useEffect(() => {
    // Hook SEMPRE é chamado. Mas só cria chart se tiver dados.
    if (!hasData) return;

    const canvas = chartRef.current;
    if (!canvas) return;

    // destrói anterior
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
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
    <div className="w-[50%] p-4 bg-white rounded-lg shadow-lg" style={{ height: "300px" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartLinhas;