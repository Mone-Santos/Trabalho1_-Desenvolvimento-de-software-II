

const db = require('../data/db-memoria');
const emprestimosController = {};

// GET /emprestimos - Lista todos os empréstimos
emprestimosController.listarTodos = (req, res) => {
    res.status(200).json(db.emprestimos);
};

// POST /emprestimos - Cria um novo empréstimo
emprestimosController.criar = (req, res) => {
    const { estudanteId, livroId } = req.body;

    // Validação simples: verificar se enviaram os IDs
    if (!estudanteId || !livroId) {
        return res.status(400).json({ 
            erro: { codigo: "DADOS_INVALIDOS", mensagem: "estudanteId e livroId são obrigatórios" } 
        });
    }

    const novoId = db.emprestimos.length > 0 ? db.emprestimos[db.emprestimos.length - 1].id + 1 : 1;
    
    const novoEmprestimo = { 
        id: novoId, 
        estudanteId: estudanteId, 
        livroId: livroId, 
        data: new Date().toISOString() 
    };
    
    db.emprestimos.push(novoEmprestimo);
    res.status(201).json(novoEmprestimo);
};


// Lista apenas os empréstimos de um estudante específico
emprestimosController.listarPorEstudante = (req, res) => {
    const estudanteId = parseInt(req.params.id);
    
    // Filtra o array para encontrar apenas os empréstimos deste estudante
    const emprestimosDoEstudante = db.emprestimos.filter(e => e.estudanteId === estudanteId);
    
    res.status(200).json(emprestimosDoEstudante);
};

module.exports = emprestimosController;