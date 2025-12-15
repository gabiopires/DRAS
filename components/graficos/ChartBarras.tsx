import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { generateDynamicColors } from '../../utils/colorUtils';

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
    const chartInstance = useRef<Chart | null>(null);

    const labels = data?.labels ?? [];
    const values = data?.data ?? [];

    const { backgroundColors, borderColors } = generateDynamicColors(labels.length, 0.6);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Número de Pacientes',
                data: values,
                borderWidth: 1,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            }
        },
        plugins: {
            datalabels: {
                color: '#4B5563',
                anchor: 'end' as const,
                align: 'top' as const,
                offset: 4,
                font: {
                    weight: 'bold' as const,
                    size: 14,
                },
                formatter: (value: number) => value.toString()
            },
            legend: {
                display: true,
            }
        }
    };

    useEffect(() => {
        if (!chartRef.current) return;

        // Se já existe gráfico, destruímos para recriar com novos dados
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        if (ctx) {
            chartInstance.current = new Chart(ctx, {
                type: "bar",
                data: chartData,
                options: chartOptions,
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [labels, values]); // Atualiza sempre que labels ou valores mudarem

    // Agora o return condicional vem DEPOIS dos hooks
    if (!data || labels.length === 0) {
        return (
            <p className="text-gray-500 text-center py-10">
                Dados de relatório indisponíveis.
            </p>
        );
    }

    return (
        <div
            className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg"
            style={{ height: '300px' }}
        >
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ChartBarras;
