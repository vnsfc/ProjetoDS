-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FilaEspera" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteNome" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGUARDANDO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FilaEspera" ("createdAt", "id", "pacienteNome", "prioridade") SELECT "createdAt", "id", "pacienteNome", "prioridade" FROM "FilaEspera";
DROP TABLE "FilaEspera";
ALTER TABLE "new_FilaEspera" RENAME TO "FilaEspera";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
