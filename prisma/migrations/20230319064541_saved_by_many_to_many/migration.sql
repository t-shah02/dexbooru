/*
  Warnings:

  - You are about to drop the column `saverId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_saverId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "saverId";

-- CreateTable
CREATE TABLE "_savedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_savedPosts_AB_unique" ON "_savedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_savedPosts_B_index" ON "_savedPosts"("B");

-- AddForeignKey
ALTER TABLE "_savedPosts" ADD CONSTRAINT "_savedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedPosts" ADD CONSTRAINT "_savedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
