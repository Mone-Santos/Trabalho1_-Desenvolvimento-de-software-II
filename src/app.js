// src/app.js
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Linha 8: Importa a conexão que criámos no Passo 1
const prisma = require('./database/prisma');

// Importação das rotas
const categoriasRoutes = require('./routes/categorias.routes');
const livrosRoutes = require('./routes/livros.routes');
const estudantesRoutes = require('./routes/estudantes.routes');
const emprestimosRoutes = require('./routes/emprestimos.routes');

// Importação do middleware de tratamento de erros
const erroMiddleware = require('./middlewares/erro.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para interpretação de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota da documentação Swagger
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('📖 Documentação Swagger carregada em: http://localhost:3000/docs');
} catch (error) {
  console.warn('⚠️ Ficheiro de documentação docs/openapi.yaml não encontrado.');
}

// Rota Principal
app.get('/', (req, res) => {
  return res.status(200).json({
    mensagem: 'API REST de Gestão de Biblioteca a funcionar com sucesso!'
  });
});

// Registo das rotas da API
app.use('/categorias', categoriasRoutes);
app.use('/livros', livrosRoutes);
app.use('/estudantes', estudantesRoutes);
app.use('/emprestimos', emprestimosRoutes);

// Tratamento para rotas não encontradas (404)
app.use((req, res) => {
  return res.status(404).json({
    status: 404,
    erro: 'Rota Não Encontrada',
    mensagem: `O caminho '${req.originalUrl}' não foi encontrado.`
  });
});

// Middleware Global de Erros (deve ficar sempre por último)
app.use(erroMiddleware);

// Função para iniciar a aplicação e testar a conexão à base de dados
async function iniciarServidor() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor a rodar na porta ${PORT}: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar com o PostgreSQL:', error.message);
    process.exit(1);
  }
}

iniciarServidor();

module.exports = app;