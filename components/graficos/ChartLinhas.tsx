import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { generateDynamicColors } from '../../utils/colorUtils';


// Nova Interface para os dados dinâmicos
interface ChartDataSet {
    labels: string[];
    data: number[];
}

// Atualiza a tipagem para as propriedades do componente
interface GraficoBarrasProps {
    data: ChartDataSet | null; // Agora aceita os dados dinâmicos
}

// Registro único: essencial para que o Chart.js funcione corretamente.
Chart.register(...registerables, ChartDataLabels);


// O componente LineChart em TypeScript
const ChartLinhas: React.FC<GraficoBarrasProps> = ({ data }) => {
    // Referências do React
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    // Se não houver dados, retorna uma mensagem (fallback)
    if (!data || data.labels.length === 0) {
        return <p className="text-gray-500 text-center py-10">Dados de relatório indisponíveis.</p>;
    }

    //Chamada da Função para Gerar Cores
    const { backgroundColors, borderColors } = generateDynamicColors(data.labels.length, 0.6); // 0.6 é a opacidade (alpha)

    // Dados DINÂMICOS do gráfico
    const chartData = {
        // Usa os dados recebidos via prop
        labels: data.labels, 
        datasets: [{
            label: 'Número de Pacientes',
            data: data.data, // Usa os dados recebidos via prop
            borderWidth: 1,
            //cores gráfico dinâmicas
            backgroundColor: backgroundColors,
            borderColor: borderColors,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 40,
                title: {
                    display: true,
                    text: 'Vendas (unidades)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Mês'
                }
            }
        },
        plugins: {
            // Configuração do plugin de rótulos de dados
            datalabels: {
                color: '#4B5563',
                anchor: 'end' as const, 
                align: 'top' as const,
                offset: 8,
                font: {
                    weight: 'bold' as const,
                    size: 14,
                },
                formatter: (value: number) => {
                    return value.toString();
                }
            },
            legend: {
                display: true,
                position: 'top' as const,
            }
        }
    };

    useEffect(() => {
        if (chartRef.current) {
            
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            
            if (ctx) {
                // MUDANÇA PRINCIPAL: type: 'line'
                chartInstance.current = new Chart(ctx, {
                    type: 'line', 
                    data: chartData,
                    options: chartOptions,
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, backgroundColors, borderColors]); // Reexecuta se os dados ou cores mudarem

    return (
        <div className="w-[50%] p-4 bg-white rounded-lg shadow-lg" style={{ height: '300px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ChartLinhas;