/*
  Warnings:

  - You are about to drop the column `brandId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `colourId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `styleId` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `Colour` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `Size` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `Style` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_colourId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_styleId_fkey";

-- DropIndex
DROP INDEX "Item_brandId_key";

-- DropIndex
DROP INDEX "Item_categoryId_key";

-- DropIndex
DROP INDEX "Item_colourId_key";

-- DropIndex
DROP INDEX "Item_sizeId_key";

-- DropIndex
DROP INDEX "Item_styleId_key";

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "itemId" INTEGER;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "itemId" INTEGER;

-- AlterTable
ALTER TABLE "Colour" ADD COLUMN     "itemId" INTEGER;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "brandId",
DROP COLUMN "categoryId",
DROP COLUMN "colourId",
DROP COLUMN "sizeId",
DROP COLUMN "styleId";

-- AlterTable
ALTER TABLE "Size" ADD COLUMN     "itemId" INTEGER;

-- AlterTable
ALTER TABLE "Style" ADD COLUMN     "itemId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_itemId_key" ON "Brand"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_itemId_key" ON "Category"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Colour_itemId_key" ON "Colour"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Size_itemId_key" ON "Size"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Style_itemId_key" ON "Style"("itemId");

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colour" ADD CONSTRAINT "Colour_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
