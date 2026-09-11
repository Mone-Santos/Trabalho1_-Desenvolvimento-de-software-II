

/**
 * Middleware centralizado para tratamento de erros inesperados (Status 500).
 
 */
const erroMiddleware = (err, req, res, next) => {
    
    console.error("Erro interno detetado:", err.stack);

    // Devolve ao utilizador o formato de erro padronizado exigido[cite: 1]
    res.status(500).json({
        erro: {
            codigo: "ERRO_INTERNO_SERVIDOR",
            mensagem: "Ocorreu um erro inesperado no servidor."
        }
    });
};

module.exports = erroMiddleware;