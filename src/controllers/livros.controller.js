

const db = require('../data/db-memoria');
const livrosController = {};

/**
 * Método GET /livros com Filtros, Busca e Paginação
 */
livrosController.listarTodos = (req, res) => {
    let resultados = db.livros; // Começamos com todos os livros

    // 1. Busca por palavra-chave no título (ignorando maiúsculas/minúsculas)
    if (req.query.titulo) {
        const termo = req.query.titulo.toLowerCase();
        resultados = resultados.filter(livro => livro.titulo.toLowerCase().includes(termo));
    }

    // 2. Filtro exato por género[cite: 1]
    if (req.query.genero) {
        resultados = resultados.filter(livro => livro.genero === req.query.genero);
    }

    // 3. Paginação matemática
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculamos o índice de corte no array
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Cortamos o array para mostrar apenas a página pedida
    const dadosPaginados = resultados.slice(startIndex, endIndex);
    const total = resultados.length;

    // Retornamos os dados com os metadados de paginação exigidos
    res.status(200).json({
        dados: dadosPaginados,
        metadados: {
            total: total,
            paginaAtual: page,
            totalPaginas: Math.ceil(total / limit)
        }
    });
};


livrosController.buscarPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const livro = db.livros.find(l => l.id === id);
    if (!livro) return res.status(404).json({ erro: { codigo: "NAO_ENCONTRADO", mensagem: `Livro ${id} não encontrado` } });
    res.status(200).json(livro);
};

livrosController.criar = (req, res) => {
    const novoId = db.livros.length > 0 ? db.livros[db.livros.length - 1].id + 1 : 1;
    const livroCriado = { id: novoId, ...req.body };
    db.livros.push(livroCriado);
    res.status(201).json(livroCriado);
};

livrosController.substituir = (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.livros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ erro: { codigo: "NAO_ENCONTRADO", mensagem: "Livro não encontrado" } });
    db.livros[index] = { id: id, ...req.body };
    res.status(200).json(db.livros[index]);
};

livrosController.atualizarParcial = (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.livros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ erro: { codigo: "NAO_ENCONTRADO", mensagem: "Livro não encontrado" } });
    db.livros[index] = { ...db.livros[index], ...req.body };
    res.status(200).json(db.livros[index]);
};

livrosController.remover = (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.livros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ erro: { codigo: "NAO_ENCONTRADO", mensagem: "Livro não encontrado" } });
    db.livros.splice(index, 1);
    res.status(204).send();
};

module.exports = livrosController;