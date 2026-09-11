

/*
 * Objecto que simula a nossa base de dados em memória.
 
 */
const db = {
  livros: [
    { id: 1, titulo: "Torto Arado", autor: "Itamar Vieira Junior", genero: "romace" }
  ],
  estudantes: [
    { id: 1, nome: "Bernadete Silva", matricula: "202618249" }
  ],
  emprestimos: []
};

// Exportamos o objecto para que outros ficheiros possam ler e modificar estes arrays
module.exports = db;