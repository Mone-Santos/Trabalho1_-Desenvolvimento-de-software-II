// src/controllers/emprestimos.controller.js
const emprestimoRepository = require('../repositories/emprestimo.repository');

class EmprestimosController {
  async cadastrar(req, res, next) {
    try {
      const { estudanteId, livroIds } = req.body;
      const resultado = await emprestimoRepository.criarEmprestimoTransacional(estudanteId, livroIds);
      return res.status(201).json(resultado);
    } catch (error) {
      next(error); // Encaminha para o erro.middleware.js
    }
  }

  async listarPorEstudante(req, res, next) {
    try {
      const { id } = req.params;
      const emprestimos = await emprestimoRepository.listarPorEstudante(id);
      return res.status(200).json(emprestimos);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmprestimosController();