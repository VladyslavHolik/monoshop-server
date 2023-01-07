/*
  Warnings:

  - You are about to drop the column `hasSeen` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "hasSeen";

-- CreateTable
CREATE TABLE "_hasSeen" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_hasSeen_AB_unique" ON "_hasSeen"("A", "B");

-- CreateIndex
CREATE INDEX "_hasSeen_B_index" ON "_hasSeen"("B");

-- AddForeignKey
ALTER TABLE "_hasSeen" ADD CONSTRAINT "_hasSeen_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hasSeen" ADD CONSTRAINT "_hasSeen_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
