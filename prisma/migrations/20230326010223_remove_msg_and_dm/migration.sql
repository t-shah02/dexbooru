/*
  Warnings:

  - You are about to drop the `DirectMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DirectMessageToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_directMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_DirectMessageToUser" DROP CONSTRAINT "_DirectMessageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DirectMessageToUser" DROP CONSTRAINT "_DirectMessageToUser_B_fkey";

-- DropTable
DROP TABLE "DirectMessage";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "_DirectMessageToUser";
