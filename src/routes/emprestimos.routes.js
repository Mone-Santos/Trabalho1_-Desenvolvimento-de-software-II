// src/routes/emprestimos.routes.js
const express = require('express');
const router = express.Router();
const emprestimosController = require('../controllers/emprestimos.controller');
const { validarEmprestimo } = require('../middlewares/validacao.middleware');

router.post('/', validarEmprestimo, emprestimosController.cadastrar);

module.exports = router;