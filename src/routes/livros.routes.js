// src/routes/livros.routes.js

const express = require('express');
const router = express.Router();
const livrosController = require('../controllers/livros.controller');

// Importamos a nossa validação
const { validarLivro } = require('../middlewares/validacao.middleware');

router.get('/', livrosController.listarTodos);
router.get('/:id', livrosController.buscarPorId);


router.post('/', validarLivro, livrosController.criar);
router.put('/:id', validarLivro, livrosController.substituir);

router.patch('/:id', livrosController.atualizarParcial);
router.delete('/:id', livrosController.remover);

module.exports = router;