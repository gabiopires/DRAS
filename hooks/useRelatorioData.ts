import { useEffect, useState } from "react";

export default function useRelatorioData() {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadAll() {
            try {
                const endpoints = [
                    "dilacao",
                    "atendidosMes",
                    "regiao",
                    "encaminhamento"
                ];

                const results = await Promise.all(
                    endpoints.map(async ep => {
                        try {
                            const res = await fetch(`/api/apiRelatorios?action=${ep}`);
                            if (!res.ok) return null;

                            return await res.json();
                        } catch {
                            return null;
                        }
                    })
                );

                setData({
                    dilacaoData: results[0]?.dilacaoData ?? { labels: [], data: [] },
                    atendimentoMesData: results[1]?.atendimentoMesData ?? { labels: [], data: [] },
                    regiaoData: results[2]?.regiaoData ?? { labels: [], data: [] },
                    encaminhamentoData: results[3]?.encaminhamentoData ?? { labels: [], data: [] },
                });

            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        loadAll();
    }, []);

    return { data, loading, error };
}
