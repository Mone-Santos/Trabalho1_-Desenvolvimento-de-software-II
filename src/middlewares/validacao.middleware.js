

const { body, validationResult } = require('express-validator');

// Regras para validar a criação ou atualização de um livro
const validarLivro = [
    // 1. O título é obrigatório e tem de ser texto (String)[cite: 1]
    body('titulo')
        .notEmpty().withMessage('O campo título é obrigatório.')
        .isString().withMessage('O título deve ser um texto.'),
    
    // 2. O autor é obrigatório
    body('autor')
        .notEmpty().withMessage('O campo autor é obrigatório.'),
    
    // 3. O género é obrigatório
    body('genero')
        .notEmpty().withMessage('O campo género é obrigatório.'),

    // 4. Função que verifica se alguma regra falhou
    (req, res, next) => {
        const erros = validationResult(req);
        
        // Se houver erros, devolvemos Status 400 com o formato padrão[cite: 1]
        if (!erros.isEmpty()) {
            return res.status(400).json({
                erro: {
                    codigo: "DADOS_INVALIDOS",
                    // Pega a mensagem do primeiro erro encontrado
                    mensagem: erros.array()[0].msg 
                }
            });
        }
        
        // Se estiver tudo correto, passa para o controlador (next)
        next();
    }
];

module.exports = { validarLivro };