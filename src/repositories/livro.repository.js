import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

class LivroRepository {
  /**
   * Listagem com Paginação Real, Filtro por Título/Categoria e Ordenação Dinâmica no PostgreSQL
   */
  async listarComFiltros({ pagina = 1, limite = 10, titulo, categoriaId, ordenar = 'titulo', direcao = 'asc' }) {
    const pageNumber = Number(pagina) > 0 ? Number(pagina) : 1;
    const limitNumber = Number(limite) > 0 ? Number(limite) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Construção do filtro 'where' no banco (incluindo verificação do Soft Delete)
    const where = {
      deletadoEm: null
    };

    if (titulo) {
      where.titulo = { contains: titulo, mode: 'insensitive' };
    }

    if (categoriaId) {
      where.categoriaId = Number(categoriaId);
    }

    // Consulta real no banco de dados usando LIMIT (take) e OFFSET (skip)
    const [total, dados] = await Promise.all([
      prisma.livro.count({ where }),
      prisma.livro.findMany({
        where,
        take: limitNumber,
        skip: skip,
        orderBy: {
          [ordenar]: direcao.toLowerCase() === 'desc' ? 'desc' : 'asc'
        },
        include: {
          categoria: true // Evita o problema N+1 ao trazer a categoria junta
        }
      })
    ]);

    return {
      meta: {
        totalRegistos: total,
        paginaAtual: pageNumber,
        totalPaginas: Math.ceil(total / limitNumber),
        itensPorPagina: limitNumber
      },
      dados
    };
  }

  async softDelete(id) {
    return await prisma.livro.update({
      where: { id: Number(id) },
      data: { deletadoEm: new Date() }
    });
  }
}

module.exports = new LivroRepository();