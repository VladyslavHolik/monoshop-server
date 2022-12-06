/*
  Warnings:

  - You are about to drop the column `itemId` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Colour` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Style` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[styleId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sizeId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brandId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[colourId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Colour" DROP CONSTRAINT "Colour_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Size" DROP CONSTRAINT "Size_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_itemId_fkey";

-- DropIndex
DROP INDEX "Brand_itemId_key";

-- DropIndex
DROP INDEX "Category_itemId_key";

-- DropIndex
DROP INDEX "Colour_itemId_key";

-- DropIndex
DROP INDEX "Size_itemId_key";

-- DropIndex
DROP INDEX "Style_itemId_key";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Colour" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "brandId" INTEGER,
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "colourId" INTEGER,
ADD COLUMN     "sizeId" INTEGER,
ADD COLUMN     "styleId" INTEGER;

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "itemId";

-- CreateIndex
CREATE UNIQUE INDEX "Item_styleId_key" ON "Item"("styleId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_sizeId_key" ON "Item"("sizeId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_categoryId_key" ON "Item"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_brandId_key" ON "Item"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_colourId_key" ON "Item"("colourId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_colourId_fkey" FOREIGN KEY ("colourId") REFERENCES "Colour"("id") ON DELETE SET NULL ON UPDATE CASCADE;
