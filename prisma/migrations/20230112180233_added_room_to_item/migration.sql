/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_itemId_key" ON "Room"("itemId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
