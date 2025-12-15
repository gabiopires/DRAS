import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { action } = req.query;

  if (!action) {
    return res.status(400).json({ message: "Parâmetro 'action' é obrigatório" });
  }

  let connection: any;

  try {
    connection = await pool.getConnection();

    // =====================================================
    // 1. PACIENTES EM DILAÇÃO POR TERRITÓRIO
    // =====================================================
    if (action === "dilacao") {
      const [rows]: any = await connection.query(
        `
        SELECT t.descricao AS territorio, COUNT(*) AS total
        FROM atendimento a
        JOIN pessoa p ON p.id = a.id_pessoa
        JOIN territorio t ON t.id = p.id_territorio
        WHERE a.dilacao = 'Sim'
        GROUP BY t.descricao
        ORDER BY t.descricao;
        `
      );

      connection.release();

      return res.status(200).json({
        dilacaoData: {
          labels: rows.map((r: any) => r.territorio),
          data: rows.map((r: any) => r.total),
        },
      });
    }

    // =====================================================
    // 2. ATENDIDOS POR MÊS
    // =====================================================
    if (action === "atendidosMes") {
      const [rows]: any = await connection.query(
        `
        SELECT 
            DATE_FORMAT(a.dataRecebimento, '%m/%Y') AS mes,
            COUNT(*) AS total
        FROM atendimento a
        WHERE a.dataRecebimento IS NOT NULL
        GROUP BY mes
        ORDER BY STR_TO_DATE(mes, '%m/%Y');
        `
      );

      connection.release();

      return res.status(200).json({
        atendimentoMesData: {
          labels: rows.map((r: any) => r.mes),
          data: rows.map((r: any) => r.total),
        },
      });
    }

    // =====================================================
    // 3. PACIENTES POR REGIÃO (TERRITÓRIO)
    // =====================================================
    if (action === "regiao") {
      const [rows]: any = await connection.query(
        `
        SELECT t.descricao AS territorio, COUNT(*) AS total
        FROM pessoa p
        JOIN territorio t ON t.id = p.id_territorio
        GROUP BY t.descricao
        ORDER BY t.descricao;
        `
      );

      connection.release();

      return res.status(200).json({
        regiaoData: {
          labels: rows.map((r: any) => r.territorio),
          data: rows.map((r: any) => r.total),
        },
      });
    }

    // =====================================================
    // 4. PACIENTES ENCAMINHADOS POR UNIDADE
    // =====================================================
    if (action === "encaminhamento") {
      const [rows]: any = await connection.query(
        `
        SELECT e.descricao AS unidade, COUNT(*) AS total
        FROM encaminhamento e
        JOIN atendimento a ON e.id = a.id_encaminhamento
        GROUP BY unidade
        ORDER BY unidade;
        `
      );

      connection.release();

      return res.status(200).json({
        encaminhamentoData: {
          labels: rows.map((r: any) => r.unidade),
          data: rows.map((r: any) => r.total),
        },
      });
    }

    connection.release();
    return res.status(400).json({ message: "Ação inválida" });

  } catch (error) {
    console.error("Erro na API Relatórios:", error);
    if (connection) connection.release();
    return res.status(500).json({ message: "Erro no servidor" });
  }
}
