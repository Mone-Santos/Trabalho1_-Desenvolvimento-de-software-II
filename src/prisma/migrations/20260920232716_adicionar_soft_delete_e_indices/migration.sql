/*
  Warnings:

  - You are about to drop the column `status` on the `itens_emprestimo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categorias" ADD COLUMN     "deletado_em" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "estudantes" ADD COLUMN     "deletado_em" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "itens_emprestimo" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "livros" ADD COLUMN     "deletado_em" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "estudantes_matricula_idx" ON "estudantes"("matricula");

-- CreateIndex
CREATE INDEX "livros_titulo_idx" ON "livros"("titulo");

-- CreateIndex
CREATE INDEX "livros_categoria_id_idx" ON "livros"("categoria_id");
