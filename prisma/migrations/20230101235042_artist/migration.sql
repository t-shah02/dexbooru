/*
  Warnings:

  - You are about to drop the column `totalPosts` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "artistId" TEXT;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "totalPosts";

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "Artist"("name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
