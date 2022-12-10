/*
  Warnings:

  - You are about to drop the column `favoriteUserId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_favoriteUserId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "favoriteUserId";

-- CreateTable
CREATE TABLE "_favorites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_favorites_AB_unique" ON "_favorites"("A", "B");

-- CreateIndex
CREATE INDEX "_favorites_B_index" ON "_favorites"("B");

-- AddForeignKey
ALTER TABLE "_favorites" ADD CONSTRAINT "_favorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorites" ADD CONSTRAINT "_favorites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
