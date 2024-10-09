/*
  Warnings:

  - A unique constraint covering the columns `[userId,playlistId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_playlistId_key" ON "Vote"("userId", "playlistId");
