/*
  Warnings:

  - You are about to drop the column `anamnese` on the `Prontuario` table. All the data in the column will be lost.
  - You are about to drop the column `assinado` on the `Prontuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numeroRegistro]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `evolucaoClinica` to the `Prontuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "clinicaAtuacao" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "conselhoProfissional" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "cpf" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "dataNascimento" DATETIME;
ALTER TABLE "Usuario" ADD COLUMN "dataValidade" DATETIME;
ALTER TABLE "Usuario" ADD COLUMN "diasLivres" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "estadoRegistro" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "nacionalidade" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "nomeCurso" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "nomeSupervisor" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "numeroRegistro" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "periodoAtual" INTEGER;
ALTER TABLE "Usuario" ADD COLUMN "previsaoConclusao" DATETIME;
ALTER TABLE "Usuario" ADD COLUMN "telefone" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "tipoEstagio" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prontuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
    "pacienteNome" TEXT NOT NULL,
    "evolucaoClinica" TEXT NOT NULL,
    "procedimentos" TEXT,
    "examesSolicitados" TEXT,
    "prescricoes" TEXT,
    "dataAtendimento" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "estudanteId" INTEGER NOT NULL,
    "professorId" INTEGER,
    CONSTRAINT "Prontuario_estudanteId_fkey" FOREIGN KEY ("estudanteId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prontuario_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Prontuario" ("createdAt", "estudanteId", "id", "pacienteNome", "procedimentos", "professorId", "updatedAt") SELECT "createdAt", "estudanteId", "id", "pacienteNome", "procedimentos", "professorId", "updatedAt" FROM "Prontuario";
DROP TABLE "Prontuario";
ALTER TABLE "new_Prontuario" RENAME TO "Prontuario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_numeroRegistro_key" ON "Usuario"("numeroRegistro");
