-- CreateTable
CREATE TABLE "Friendship" (
    "personOneId" TEXT NOT NULL,
    "personTwoId" TEXT NOT NULL,
    "friendsSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("personOneId","personTwoId")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_personOneId_fkey" FOREIGN KEY ("personOneId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_personTwoId_fkey" FOREIGN KEY ("personTwoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
