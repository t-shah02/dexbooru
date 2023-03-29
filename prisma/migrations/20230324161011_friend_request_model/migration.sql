/*
  Warnings:

  - You are about to drop the `_friend_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_friend_requests" DROP CONSTRAINT "_friend_requests_A_fkey";

-- DropForeignKey
ALTER TABLE "_friend_requests" DROP CONSTRAINT "_friend_requests_B_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_B_fkey";

-- DropTable
DROP TABLE "_friend_requests";

-- DropTable
DROP TABLE "_friends";

-- CreateTable
CREATE TABLE "FriendRequest" (
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("senderId","receiverId")
);

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
