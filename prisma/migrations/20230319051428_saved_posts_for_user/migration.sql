-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageIDs" TEXT[],
ADD COLUMN     "saverId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_saverId_fkey" FOREIGN KEY ("saverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
