import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Menu from "../../../components/menu/Menu";
import BotoesPagina, { ChartView } from '../../../components/graficos/BotoesPagina';
import useRelatorioData from '../../../hooks/useRelatorioData';
import Alerta from "../../../components/alerta/Alerta";
import { useRouter } from "next/router";

let dataAlerts = {
  alertText: "",
  alertButtons: [""],
  alertsCommans: [(()=> {})],
}

// Importações dinâmicas dos componentes de gráfico
const GraficoDinamicoBarras = dynamic(
    () => import('../../../components/graficos/ChartBarras'),
    { ssr: false }
);

const GraficoDinamicoLinhas = dynamic(
    () => import('../../../components/graficos/ChartLinhas'),
    { ssr: false }
);

const GraficoDinamicoPizza = dynamic(
    () => import('../../../components/graficos/ChartPizza'),
    { ssr: false }
);


export default function Relatorios() {
    // Usa useState para controlar qual gráfico está ativo
    const [activeChart, setActiveChart] = useState<ChartView>('PrimeiraPagina');
    const [showAlerts,setshowAlerts]= useState(false);
    const router = useRouter();
    //Chamar o hook de dados
    const { data, loading, error } = useRelatorioData();

    useEffect(() => {
        const perm = localStorage.getItem("permissão");
        if(!perm){
            setshowAlerts(true)
            dataAlerts = {
            alertText: "Redirecionando para o login",
            alertButtons: ["Ok"],
            alertsCommans: [()=>{setshowAlerts(false);router.push("/");}]
            } 
        }
      }, []);

    // Função para renderizar o gráfico baseado no estado 'activeChart'
    const renderChart = () => {
        //Carregando e tratamento de erros
        if (loading) {
            return <p className="text-xl text-center py-10 text-gray-500">Carregando dados...</p>;
        }

        //Avisando erro
        if (error || !data) {
            return <p className="text-xl text-center py-10 text-red-600">Erro ao carregar dados: {error}</p>;
        }

        let chartComponent, title;

        if (activeChart === 'PrimeiraPagina') {
            chartComponent = <GraficoDinamicoBarras data={data.dilacaoData} />;
            title = "Pacientes em Dilação";
        } else if (activeChart === 'SegundaPagina') {
            chartComponent = <GraficoDinamicoLinhas data={data.atendimentoMesData}/>;
            title = "Pacientes Atendidos por Mês";
        } else if  (activeChart === 'TerceiraPagina') {
            chartComponent = <GraficoDinamicoPizza data={data.dilacaoData}/>;
            title = "Pacientes por Região";
        } else if (activeChart === 'QuartaPagina') {
            chartComponent = <GraficoDinamicoBarras data={data.orgaoEncaminhadorData}/>;
            title = "Pacientes Encaminhados por Unidade";
        }
         else  {
            // Retorno de fallback
            return <p className="text-gray-500 text-center py-10">Selecione um tipo de gráfico acima.</p>;
        }

        return (
            // Contêiner para o gráfico e título
            <div className="bg-white p-8 rounded-xl w-full flex flex-col">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-left">{title}</h2>
                <div className='w-full flex justify-center'>{chartComponent}</div>
            </div>
        );
    };

    return (
        <>
            <Menu page={4}/>
            <div style={{ paddingLeft: "250px", marginTop: "150px" , textAlign: "center" }}>
                <div className="mt-8 max-w-7xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Relatórios Pacientes</h1>
                    
                    {/* Área botões - Ativa gráficos */}
                    <BotoesPagina  activeChart={activeChart}  onSwitch={setActiveChart}  />

                    {/* Área de Inclusão gráfico */}
                    <div className="min-h-[20px] flex items-center justify-center">
                        {renderChart()}
                    </div>
                </div>
            </div>
        </>
    );
}