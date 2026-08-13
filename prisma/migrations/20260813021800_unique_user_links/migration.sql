/*
  Warnings:

  - A unique constraint covering the columns `[userId,originalUrl]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_userId_originalUrl_key" ON "Link"("userId", "originalUrl");
