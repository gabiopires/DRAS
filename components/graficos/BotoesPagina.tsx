import React from 'react';

// Exporta o tipo para ser usado no componente pai (Relatorios)
export type ChartView = "PrimeiraPagina" | 'SegundaPagina' | 'TerceiraPagina' | 'QuartaPagina';

interface BotoesPaginaProps {
    activeChart: ChartView;
    // A função onSwitch será o setState do componente pai
    onSwitch: (view: ChartView) => void; 
}

const BotoesPagina: React.FC<BotoesPaginaProps> = ({ activeChart, onSwitch }) => {
    
    // Função para aplicar estilos condicionais
    const getButtonClasses = (view: ChartView) => 
        `px-6 py-2 rounded-lg font-semibold transition duration-200 ease-in-out cursor-pointer ${
            activeChart === view
                ? 'bg-orange-400 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`;

    return (
        <div className="flex space-x-4 mb-6 justify-center">
            <button 
                className={getButtonClasses('PrimeiraPagina')}
                onClick={() => onSwitch('PrimeiraPagina')} 
            >
                Pacientes em Dilação
            </button>
            <button 
                className={getButtonClasses('SegundaPagina')}
                onClick={() => onSwitch('SegundaPagina')}
            >
                Atendimentos por Mês
            </button>
            <button 
                className={getButtonClasses('TerceiraPagina')}
                onClick={() => onSwitch('TerceiraPagina')}
            >
                Pacientes por Região
            </button>
            <button 
                className={getButtonClasses('QuartaPagina')}
                onClick={() => onSwitch('QuartaPagina')} 
            >
                Encaminhamentos por Empresa
            </button>
        </div>
    );
};

export default BotoesPagina;