/*
  Warnings:

  - You are about to drop the column `itemId` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Colour` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `brandId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colourId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `styleId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Colour" DROP CONSTRAINT "Colour_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_userId_fkey";

-- DropForeignKey
ALTER TABLE "Size" DROP CONSTRAINT "Size_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_itemId_fkey";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Colour" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "brandId" INTEGER NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "colourId" INTEGER NOT NULL,
ADD COLUMN     "sizeId" INTEGER NOT NULL,
ADD COLUMN     "styleId" INTEGER NOT NULL,
ALTER COLUMN "images" SET NOT NULL,
ALTER COLUMN "images" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" TEXT NOT NULL;

-- DropTable
DROP TABLE "Location";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_colourId_fkey" FOREIGN KEY ("colourId") REFERENCES "Colour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
