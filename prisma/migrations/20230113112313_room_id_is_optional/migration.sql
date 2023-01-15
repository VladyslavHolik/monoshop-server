-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_roomId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "roomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
