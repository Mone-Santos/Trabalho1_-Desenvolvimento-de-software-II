
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

class EmprestimoRepository {
  /**
   * Operação Transacional: Regista o empréstimo, associa os livros e decrementa o stock
   */
  async criarEmprestimoTransacional(estudanteId, livroIds) {
    return await prisma.$transaction(async (tx) => {
      // 1. Verificar disponibilidade de todos os livros
      const livros = await tx.livro.findMany({
        where: { id: { in: livroIds } }
      });

      if (livros.length !== livroIds.length) {
        throw { status: 404, message: 'Um ou mais livros fornecidos não foram encontrados.' };
      }

      for (const livro of livros) {
        if (livro.disponiveis <= 0) {
          throw { status: 400, message: `O livro '${livro.titulo}' não tem exemplares disponíveis no momento.` };
        }
      }

      // 2. Criar o registo do Empréstimo
      const novoEmprestimo = await tx.emprestimo.create({
        data: {
          estudanteId: Number(estudanteId)
        }
      });

      // 3. Criar os Itens do Empréstimo (Tabela de Junção N:M) e decrementar o stock de livros
      for (const livroId of livroIds) {
        await tx.itemEmprestimo.create({
          data: {
            emprestimoId: novoEmprestimo.id,
            livroId: Number(livroId)
          }
        });

        // Decrementa 1 exemplar disponível no livro
        await tx.livro.update({
          where: { id: Number(livroId) },
          data: { disponiveis: { decrement: 1 } }
        });
      }

      // Retorna o empréstimo criado com os seus relacionamentos carregados
      return await tx.emprestimo.findUnique({
        where: { id: novoEmprestimo.id },
        include: {
          estudante: true,
          itens: {
            include: { livro: true }
          }
        }
      });
    });
  }

  async listarPorEstudante(estudanteId) {
    return await prisma.emprestimo.findMany({
      where: { estudanteId: Number(estudanteId) },
      include: {
        itens: {
          include: { livro: true }
        }
      }
    });
  }
}

module.exports = new EmprestimoRepository();