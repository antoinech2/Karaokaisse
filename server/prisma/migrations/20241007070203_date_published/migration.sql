/*
  Warnings:

  - Added the required column `publishedAt` to the `Songs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Songs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL
);
INSERT INTO "new_Songs" ("artist", "channel", "id", "title", "videoId") SELECT "artist", "channel", "id", "title", "videoId" FROM "Songs";
DROP TABLE "Songs";
ALTER TABLE "new_Songs" RENAME TO "Songs";
CREATE UNIQUE INDEX "Songs_videoId_key" ON "Songs"("videoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
