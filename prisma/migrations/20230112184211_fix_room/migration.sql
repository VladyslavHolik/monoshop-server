/*
  Warnings:

  - You are about to drop the column `itemId` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_itemId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "itemId";

-- CreateIndex
CREATE UNIQUE INDEX "Item_roomId_key" ON "Item"("roomId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
