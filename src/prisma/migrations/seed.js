// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 A iniciar o povoamento da base de dados (Seed)...');

  // Limpar registos anteriores
  await prisma.itemEmprestimo.deleteMany();
  await prisma.emprestimo.deleteMany();
  await prisma.livro.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.estudante.deleteMany();

  // 1. Criar Categorias
  const categoriasData = [
    { nome: 'Ficção Científica', descricao: 'Obras de exploração e futuro' },
    { nome: 'Engenharia de Software', descricao: 'Livros técnicos de programação' },
    { nome: 'Bases de Dados', descricao: 'SGBDs, SQL e modelagem' },
    { nome: 'História', descricao: 'Fatos e acontecimentos históricos' },
    { nome: 'Filosofia', descricao: 'Pensamento e lógica' },
    { nome: 'Matemática', descricao: 'Álgebra e cálculo' },
    { nome: 'Literatura Clássica', descricao: 'Obras imortais' },
    { nome: 'Psicologia', descricao: 'Estudo do comportamento' },
    { nome: 'Economia', descricao: 'Mercados e finanças' },
    { nome: 'Redes de Computadores', descricao: 'Infraestrutura e protocolos' }
  ];

  await prisma.categoria.createMany({ data: categoriasData });
  const categorias = await prisma.categoria.findMany();

  // 2. Criar Livros (mínimo 10)
  const livrosData = Array.from({ length: 12 }).map((_, i) => ({
    titulo: `Livro de Exemplo ${i + 1}`,
    autor: `Autor Famoso ${i + 1}`,
    totalExemplares: 5,
    disponiveis: 5,
    categoriaId: categorias[i % categorias.length].id
  }));

  await prisma.livro.createMany({ data: livrosData });

  // 3. Criar Estudantes (mínimo 10)
  const estudantesData = Array.from({ length: 10 }).map((_, i) => ({
    nome: `Estudante ${i + 1}`,
    matricula: `EST2026${(i + 1).toString().padStart(3, '0')}`,
    email: `estudante${i + 1}@escola.edu.pt`
  }));

  await prisma.estudante.createMany({ data: estudantesData });

  console.log('✅ Base de dados povoada com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });