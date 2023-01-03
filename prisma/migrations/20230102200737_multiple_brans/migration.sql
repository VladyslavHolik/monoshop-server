/*
  Warnings:

  - You are about to drop the column `brandId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_brandId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "brandId";

-- CreateTable
CREATE TABLE "_BrandToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BrandToItem_AB_unique" ON "_BrandToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandToItem_B_index" ON "_BrandToItem"("B");

-- AddForeignKey
ALTER TABLE "_BrandToItem" ADD CONSTRAINT "_BrandToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToItem" ADD CONSTRAINT "_BrandToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
