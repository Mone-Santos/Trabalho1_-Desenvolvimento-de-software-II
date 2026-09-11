// app.js

const express = require('express');
const app = express();


app.use(express.json());


// --- CONFIGURAÇÃO DA DOCUMENTAÇÃO SWAGGER ---

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Carregamos o ficheiro YAML que acabámos de criar
const swaggerDocument = YAML.load('./src/docs/swagger.yaml');

// Criamos uma rota especial '/api-docs' para ver a interface gráfica
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// --------------------------------------------



// --- IMPORTAÇÃO DAS ROTAS ---
// Usamos o prefixo /api/v1 para manter a API bem estruturada

// 1. Rotas de Livros
const livrosRoutes = require('./src/routes/livros.routes');
app.use('/api/v1/livros', livrosRoutes);

// 2. Rotas de Estudantes
const estudantesRoutes = require('./src/routes/estudantes.routes');
app.use('/api/v1/estudantes', estudantesRoutes);

// 3. Rotas de Empréstimos (Agora declarada apenas UMA vez!)
const emprestimosRoutes = require('./src/routes/emprestimos.routes');
app.use('/api/v1/emprestimos', emprestimosRoutes);

// --- ROTA DE TESTE ---
app.get('/api/ping', (req, res) => {
    res.status(200).json({ mensagem: "Servidor da Biblioteca a funcionar perfeitamente!" });
});

// --- TRATAMENTO DE ERROS ---

const erroMiddleware = require('./src/middlewares/erro.middleware');
app.use(erroMiddleware);

// --- INICIAÇÃO DO SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
    console.log(`Acede aos livros em: http://localhost:${PORT}/api/v1/livros`);
});