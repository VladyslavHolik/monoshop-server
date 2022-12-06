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

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "itemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "itemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Colour" ALTER COLUMN "itemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Size" ALTER COLUMN "itemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Style" ALTER COLUMN "itemId" DROP NOT NULL;

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
