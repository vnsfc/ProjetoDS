-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agenda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADO',
    "pacienteNome" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Agenda_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Agenda" ("createdAt", "data", "id", "pacienteNome", "status", "updatedAt", "usuarioId") SELECT "createdAt", "data", "id", "pacienteNome", "status", "updatedAt", "usuarioId" FROM "Agenda";
DROP TABLE "Agenda";
ALTER TABLE "new_Agenda" RENAME TO "Agenda";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
