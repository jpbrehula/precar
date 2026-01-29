import { Client } from "pg";

/**
 * Executa uma query no PostgreSQL
 * - Abre conexão
 * - Executa a query
 * - Fecha a conexão SEMPRE (sucesso ou erro)
 *
 * Se der erro:
 * - Loga o erro
 * - Relança o erro para quem chamou tratar
 */
async function query(queryObject) {
  // Cria um cliente de conexão com o banco
  // (dados vêm das variáveis de ambiente)
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "development" ? false : true,
  });

  try {
    // Abre a conexão com o banco
    await client.connect();

    // Executa a query recebida como parâmetro
    const result = await client.query(queryObject);

    // Retorna o resultado para quem chamou
    return result;
  } catch (error) {
    // Loga o erro para debug (logs, testes, CI, etc)
    console.error(error);

    // Relança o erro para o nível acima decidir o que fazer
    // (API retorna 500, teste falha, etc)
    throw error;
  } finally {
    // SEMPRE fecha a conexão com o banco
    // Mesmo se der erro no connect ou na query
    await client.end();
  }
}

// Exporta como database.query(...)
export default {
  query: query,
};
