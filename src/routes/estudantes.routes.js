// src/routes/estudantes.routes.js

const express = require('express');
const router = express.Router();
const estudantesController = require('../controllers/estudantes.controller');

// Importamos TAMBÉM o controlador de empréstimos para a rota aninhada
const emprestimosController = require('../controllers/emprestimos.controller');

// --- Rota Aninhada Obrigatória ---[cite: 1]
// Quando acederem a /estudantes/1/emprestimos, chamamos esta função
router.get('/:id/emprestimos', emprestimosController.listarPorEstudante);

// --- Rotas Principais de Estudantes ---
router.get('/', estudantesController.listarTodos);
router.get('/:id', estudantesController.buscarPorId);
router.post('/', estudantesController.criar);
router.put('/:id', estudantesController.substituir);
router.patch('/:id', estudantesController.atualizarParcial);
router.delete('/:id', estudantesController.remover);

module.exports = router;