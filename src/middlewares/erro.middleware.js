/// src/middlewares/erro.middleware.js
const { Prisma } = require('@prisma/client');

function erroMiddleware(err, req, res, next) {
  console.error('❌ [ERRO CAPTURADO]:', err);

  // Erros conhecidos gerados pelo Prisma ORM
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Violação de restrição UNIQUE (Ex: e-mail ou matrícula já cadastrada)
    if (err.code === 'P2002') {
      const campos = err.meta?.target ? err.meta.target.join(', ') : 'campo';
      return res.status(409).json({
        status: 409,
        erro: 'Conflito de Dados',
        mensagem: `Já existe um registo com este valor no campo: ${campos}.`
      });
    }

    // P2025: Registo não encontrado no banco
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 404,
        erro: 'Registo Não Encontrado',
        mensagem: 'O registo solicitado não foi localizado na base de dados.'
      });
    }

    // P2003: Violação de Chave Estrangeira (Integridade Referencial)
    if (err.code === 'P2003') {
      return res.status(409).json({
        status: 409,
        erro: 'Violação de Integridade Referencial',
        mensagem: 'Não é possível realizar a operação pois o registo está associado a outros dados.'
      });
    }
  }

  // Erro personalizado lançado pelas transações/regras de negócio
  if (err.status) {
    return res.status(err.status).json({
      status: err.status,
      erro: 'Regra de Negócio',
      mensagem: err.message
    });
  }

  // Resposta padrão para erros inesperados do servidor (sem vazar mensagem bruta do SGBD)
  return res.status(500).json({
    status: 500,
    erro: 'Erro Interno do Servidor',
    mensagem: 'Ocorreu um erro inesperado ao processar a requisição.'
  });
}

module.exports = erroMiddleware;