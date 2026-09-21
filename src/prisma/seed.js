// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 A iniciar o povoamento da base de dados (Seed)...');

  // ---------------------------------------------------------------------------
  // 1. Limpeza dos Dados Existentes (Ordem inversa das Chaves Estrangeiras)
  // ---------------------------------------------------------------------------
  await prisma.itemEmprestimo.deleteMany();
  await prisma.emprestimo.deleteMany();
  await prisma.livro.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.estudante.deleteMany();

  console.log('🧹 Base de dados limpa com sucesso.');

  // ---------------------------------------------------------------------------
  // 2. Inserção de Categorias (Mínimo 10)
  // ---------------------------------------------------------------------------
  const categoriasData = [
    { nome: 'Ficção Científica', descricao: 'Livros de exploração espacial e tecnologia' },
    { nome: 'Engenharia de Software', descricao: 'Programação, arquitetura e boas práticas' },
    { nome: 'Bases de Dados', descricao: 'SGBDs, SQL, NoSQL e modelagem de dados' },
    { nome: 'História', descricao: 'Acontecimentos e civilizações históricas' },
    { nome: 'Filosofia', descricao: 'Obras sobre lógica e pensamento crítico' },
    { nome: 'Matemática', descricao: 'Álgebra, cálculo e estatística' },
    { nome: 'Literatura Clássica', descricao: 'Romances e obras imortais' },
    { nome: 'Psicologia', descricao: 'Comportamento humano e mente' },
    { nome: 'Economia', descricao: 'Finanças, mercados e investimentos' },
    { nome: 'Redes de Computadores', descricao: 'Infraestrutura, protocolos e segurança' }
  ];

  await prisma.categoria.createMany({ data: categoriasData });
  const categorias = await prisma.categoria.findMany({ orderBy: { id: 'asc' } });
  console.log(`✅ ${categorias.length} Categorias criadas.`);

  // ---------------------------------------------------------------------------
  // 3. Inserção de Livros (Mínimo 10, vinculados às Categorias)
  // ---------------------------------------------------------------------------
  const livrosData = [
    { titulo: 'Duna', autor: 'Frank Herbert', totalExemplares: 5, disponiveis: 5, categoriaId: categorias[0].id },
    { titulo: 'Neuromancer', autor: 'William Gibson', totalExemplares: 3, disponiveis: 3, categoriaId: categorias[0].id },
    { titulo: 'Clean Code', autor: 'Robert C. Martin', totalExemplares: 4, disponiveis: 4, categoriaId: categorias[1].id },
    { titulo: 'Refactoring', autor: 'Martin Fowler', totalExemplares: 2, disponiveis: 2, categoriaId: categorias[1].id },
    { titulo: 'Designing Data-Intensive Applications', autor: 'Martin Kleppmann', totalExemplares: 6, disponiveis: 6, categoriaId: categorias[2].id },
    { titulo: 'Sapiens: História da Humanidade', autor: 'Yuval Noah Harari', totalExemplares: 8, disponiveis: 8, categoriaId: categorias[3].id },
    { titulo: 'A República', autor: 'Platão', totalExemplares: 3, disponiveis: 3, categoriaId: categorias[4].id },
    { titulo: 'Cálculo Volume 1', autor: 'James Stewart', totalExemplares: 10, disponiveis: 10, categoriaId: categorias[5].id },
    { titulo: 'Dom Casmurro', autor: 'Machado de Assis', totalExemplares: 5, disponiveis: 5, categoriaId: categorias[6].id },
    { titulo: 'O Poder do Hábito', autor: 'Charles Duhigg', totalExemplares: 4, disponiveis: 4, categoriaId: categorias[7].id },
    { titulo: 'Pai Rico, Pai Pobre', autor: 'Robert Kiyosaki', totalExemplares: 7, disponiveis: 7, categoriaId: categorias[8].id },
    { titulo: 'Redes de Computadores', autor: 'Andrew S. Tanenbaum', totalExemplares: 5, disponiveis: 5, categoriaId: categorias[9].id }
  ];

  await prisma.livro.createMany({ data: livrosData });
  const livros = await prisma.livro.findMany({ orderBy: { id: 'asc' } });
  console.log(`✅ ${livros.length} Livros criados.`);

  // ---------------------------------------------------------------------------
  // 4. Inserção de Estudantes (Mínimo 10)
  // ---------------------------------------------------------------------------
  const estudantesData = Array.from({ length: 10 }).map((_, index) => {
    const idNum = index + 1;
    return {
      nome: `Estudante Exemplo ${idNum}`,
      matricula: `EST2026${idNum.toString().padStart(3, '0')}`,
      email: `estudante${idNum}@escola.edu.pt`
    };
  });

  await prisma.estudante.createMany({ data: estudantesData });
  const estudantes = await prisma.estudante.findMany({ orderBy: { id: 'asc' } });
  console.log(`✅ ${estudantes.length} Estudantes criados.`);

  // ---------------------------------------------------------------------------
  // 5. Inserção de Empréstimo de Exemplo (Relacionamento N:M)
  // ---------------------------------------------------------------------------
  const novoEmprestimo = await prisma.emprestimo.create({
    data: {
      estudanteId: estudantes[0].id,
      itens: {
        create: [
          { livroId: livros[0].id }, // Duna
          { livroId: livros[2].id }  // Clean Code
        ]
      }
    }
  });

  // Atualiza a contagem de exemplares disponíveis dos livros emprestados
  await prisma.livro.update({
    where: { id: livros[0].id },
    data: { disponiveis: { decrement: 1 } }
  });
  await prisma.livro.update({
    where: { id: livros[2].id },
    data: { disponiveis: { decrement: 1 } }
  });

  console.log(`✅ 1 Empréstimo de teste criado (ID: ${novoEmprestimo.id}) com 2 livros associados.`);
  console.log('🎉 Povoamento da base de dados concluído com sucesso!');
}

// -----------------------------------------------------------------------------
// Execução do Script com Gestão de Conexão
// -----------------------------------------------------------------------------
main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });