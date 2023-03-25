/*
  Warnings:

  - You are about to drop the column `dateSent` on the `FriendRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "dateSent",
ADD COLUMN     "sentOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
