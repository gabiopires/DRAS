/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  //AUTENTICAÇÃO
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Você precisa estar logado." });
  }

  try {
    const JWT_SECRET = String(process.env.JWT_SECRET);
    jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }

  const { nome = "", referencia = "", endereco = "", territorio = "", action } = req.query;
  let connection;

  const baseQuery = `
    SELECT ate.id AS idAtendimento,
      ate.dataRecebimento, ate.acolhimentoInstitucional, ate.dilacao, ate.dataDilacao,
      ate.orgaoEncaminhador, ate.referencia, ate.sigps, ate.finalizado,
      en.id AS idEncaminhamento, en.descricao AS encaminhamento,
      tec.id AS idTecnicoResponsavel, tec.nome AS tecnicoResponsavel,
      vio.id AS idViolacao, vio.descricao AS violacao,
      vul.id AS idVulnerabilidade, vul.descricao AS vulnerabilidade,
      pAte.id AS idPrazoAtendimento, pAte.descricao AS prazoAtendimento,
      ate.fimPrevistoAtendimento, ate.id_pessoa AS idPessoa,
      p.nome, p.identificacao, p.endereco, p.sexo, p.referenciaFamiliar, p.deficiencia, p.situacaoRua,
      iden.id AS idTipoIdentificacao, iden.descricao AS tipoIdentificacao,
      caU.id AS idCategoria, caU.descricao AS categoria,
      t.id AS idTerritorio, t.descricao AS territorio,
      cenSau.id AS idCentroSaude, cenSau.descricao AS centroSaude
    FROM atendimento ate
    LEFT JOIN pessoa p ON ate.id_pessoa = p.id
    LEFT JOIN categoriaUsuario caU ON p.id_categoriaUsuario = caU.id
    LEFT JOIN territorio t ON p.id_territorio = t.id
    LEFT JOIN encaminhamento en ON ate.id_encaminhamento = en.id
    LEFT JOIN tecnicoResponsavel tec ON ate.id_tecnicoResponsavel = tec.id
    LEFT JOIN tiposViolacao vio ON ate.id_violacao = vio.id
    LEFT JOIN tiposVulnerabilidade vul ON ate.id_tiposVulnerabilidade = vul.id
    LEFT JOIN prazoAtendimento pAte ON ate.id_prazoAtendimento = pAte.id
    LEFT JOIN tiposIdentificacao iden ON p.id_tiposIdentificacao = iden.id
    LEFT JOIN tiposCentroSaude cenSau ON p.id_centroSaude = cenSau.id
  `;

  try {
    connection = await pool.getConnection();

    //BUSCA TODOS OS ATENDIMENTOS NÃO FINALIZADOS
    if (action === "getAll") {
      const [rows]: any = await connection.query(`
        ${baseQuery}
        WHERE ate.finalizado = 'Não'
        ORDER BY ABS(DATEDIFF(ate.fimPrevistoAtendimento, NOW())) ASC;
      `);
      connection.release();
      return res.status(200).json({ person: rows });
    }

    //BUSCA UM ATENDIMENTO ESPECÍFICO
    if (action === "search") {
      const [rows]: any = await connection.query(`
        ${baseQuery}
        WHERE p.nome LIKE CONCAT('%', ?, '%')
          AND p.endereco LIKE CONCAT('%', ?, '%')
          AND p.referenciaFamiliar LIKE CONCAT('%', ?, '%')
          AND COALESCE(t.descricao, '') LIKE CONCAT('%', ?, '%')
        ORDER BY ABS(DATEDIFF(ate.fimPrevistoAtendimento, NOW())) ASC;
      `, [nome, endereco, referencia, territorio]);
      
      connection.release();
      return res.status(200).json({ person: rows });
    }

    connection.release();
    return res.status(400).json({ message: "Ação inválida" });

  } catch (error) {
    console.error("Erro na API de listagem:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}