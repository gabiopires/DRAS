import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { generateDynamicColors } from '../../utils/colorUtils';

interface ChartDataSet {
    labels: string[];
    data: number[];
}
// Tipagem para as propriedades do componente
interface GraficoPizzaProps {
    data: ChartDataSet | null; // Agora aceita os dados dinâmicos
}

// Incluímos o plugin ChartDataLabels para mostrar os valores nas fatias.
Chart.register(...registerables, ChartDataLabels);

// O componente PieChart em TypeScript
const ChartPizza: React.FC<GraficoPizzaProps> = ({ data }) => {

    // Se não houver dados, retorna uma mensagem (fallback)
    if (!data || data.labels.length === 0) {
        return <p className="text-gray-500 text-center py-10">Dados de relatório indisponíveis.</p>;
    }

    //Chamada da Função para Gerar Cores
    const { backgroundColors, borderColors } = generateDynamicColors(data.labels.length, 0.6); // 0.6 é a opacidade (alpha)

    // Referências do React para o canvas e a instância do gráfico
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

// Dados DINÂMICOS do gráfico
    const chartData = {
        // Usa os dados recebidos via prop
        labels: data.labels, 
        datasets: [{
            label: 'Número de Pacientes',
            data: data.data, // Usa os dados recebidos via prop
            borderWidth: 1,
            // Usando as cores dinâmicas geradas
            backgroundColor: backgroundColors,
            borderColor: borderColors,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            // Configuração da legenda para gráficos de pizza
            legend: {
                position: 'right' as const, // Coloca a legenda à direita
                labels: {
                    font: {
                        size: 14,
                    }
                }
            },
            // Configuração do plugin de rótulos de dados para mostrar valores/porcentagens
            datalabels: {
                color: '#4B5563',
                //'#fff', // Cor do texto dos rótulos (branco para maior contraste)
                font: {
                    weight: 'bold' as const,
                    size: 14,
                },
                formatter: (value: number, context: any) => {
                    const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                    return  value + " - " + percentage; // Exibe a quantidade e a porcentagem
                },
                // Posiciona os rótulos um pouco para fora do centro
                anchor: 'end' as const,
                align: 'end' as const,
                offset: 5,
            }
        }
    };

    // useEffect para a lógica de criação e destruição do gráfico
    useEffect(() => {
        if (chartRef.current) {
            // Destrói a instância anterior para evitar problemas de re-renderização
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            
            if (ctx) {
                // MUDANÇA PRINCIPAL: type: 'pie'
                chartInstance.current = new Chart(ctx, {
                    type: 'doughnut', 
                    data: chartData,
                    options: chartOptions,
                });
            }
        }

        // Função de limpeza
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, backgroundColors, borderColors]); // Reexecuta se os dados ou cores mudarem

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg" style={{ height: '300px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ChartPizza;