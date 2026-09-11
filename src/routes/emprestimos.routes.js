
const express = require('express');
const router = express.Router();
const emprestimosController = require('../controllers/emprestimos.controller');

// Rotas principais[cite: 1]
router.get('/', emprestimosController.listarTodos);
router.post('/', emprestimosController.criar);

module.exports = router;