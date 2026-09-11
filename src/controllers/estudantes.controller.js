

const db = require('../data/db-memoria');
const estudantesController = {};

// GET /estudantes - Lista todos[cite: 1]
estudantesController.listarTodos = (req, res) => {
    res.status(200).json(db.estudantes);
};

// GET /estudantes/:id - Busca um por ID[cite: 1]
estudantesController.buscarPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const estudante = db.estudantes.find(e => e.id === id);

    if (!estudante) {
        return res.status(404).json({ erro: { codigo: "RECURSO_NAO_ENCONTRADO", mensagem: `Estudante com id ${id} não encontrado` } });
    }
    res.status(200).json(estudante);
};

// POST /estudantes - Cria novo estudante[cite: 1]
estudantesController.criar = (req, res) => {
    const novoId = db.estudantes.length > 0 ? db.estudantes[db.estudantes.length - 1].id + 1 : 1;
    const estudanteCriado = { id: novoId, ...req.body };
    db.estudantes.push(estudanteCriado);
    res.status(201).json(estudanteCriado);
};

// PUT /estudantes/:id - Substitui estudante[cite: 1]
estudantesController.substituir = (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.estudantes.findIndex(e => e.id === id);

    if (index === -1) return res.status(404).json({ erro: { codigo: "NAO_ENCONTRADO", mensagem: "Estudante não encontrado" } });

    db.estudantes[index] = { id: id, ...req.body };
    res.status(200).json(db.estudantes[index]);
};

// PATCH /estudantes/:id - Atualiza parcialmente[cite: 1]
estudantesController.atualizarParcial = (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.estudantes.findIndex(e => e.id === id);

    if (index === -1) return res.status(404).json({ erro: { codigo: "NAO_ENCONTRADO", mensagem: "Estudante não encontrado" } });

    db.estudantes[index] = { ...db.estudantes[index], ...req.body };
    res.status(200).json(db.estudantes[index]);
};

// DELETE /estudantes/:id - Remove estudante[cite: 1]
estudantesController.remover = (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.estudantes.findIndex(e => e.id === id);

    if (index === -1) return res.status(404).json({ erro: { codigo: "NAO_ENCONTRADO", mensagem: "Estudante não encontrado" } });

    db.estudantes.splice(index, 1);
    res.status(204).send();
};

module.exports = estudantesController;